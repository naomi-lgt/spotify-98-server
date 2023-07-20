const express = require('express')
const dotenv = require('dotenv');

const port = 3333

dotenv.config()

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SEC

const app = express();

app.get('/auth/login', (req, res) => {
});

app.get('/auth/callback', (req, res) => {
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})