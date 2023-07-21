const express = require('express')
require('dotenv').config();
const request = require('request');
const cors = require('cors');

const port = 3333
const front_port = 5173;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let access_token, refresh_token;

const generateRandomString = (length) => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}))

app.get('/auth/login', (req, res) => {
  const scope = "streaming \
               user-read-email \
               user-read-private"

  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: `http://localhost:3333/auth/callback`,
    state: state
  })

  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
  console.log('auth login')
})


app.get('/auth/callback', (req, res) => {

  const code = req.query.code;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: `http://localhost:3333/auth/callback`,
      grant_type: 'authorization_code',
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      refresh_token = body.refresh_token;

      res.redirect('http://localhost:5173/')
    }
  });
})

app.get('/auth/token', (req, res) => {
  res.json(
    {
       access_token: access_token
    })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})