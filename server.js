require('dotenv').config()
const express = require('express');
var SpotifyWebApi = require('spotify-web-api-node');

var access_token1 = "";
const port = process.env.PORT || 5500;

const scopes = [
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-read-email',
    'user-read-private',
    'playlist-read-private',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
  ];

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:5500/callback'
});

const app = express();
app.use(express.static('public'));
app.listen(port, () =>
console.log(
  'HTTP Server up. Now go to http://localhost:5500/login in your browser.'
)
);

app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
  });


  app.get('/quiz', (req, res) => {
    console.log('quiz button clicked');
    res.sendFile(__dirname + '/public/quiz.html');
  });
  



  app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
  
    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
  
        console.log(typeof(data.body['access_token']));
        access_token1 = data.body['access_token'];

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
  
        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);
  
        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
        console.log('Success! You can now close the window.');

        res.send(data); //send JSON to browser
  
        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
  
          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      });
  });

  function doStuff() {
    console.log("token: "+ access_token1);
 }
 setInterval(doStuff, 3000);

  
 