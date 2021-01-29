/*
modules initialization
*/
require('dotenv').config()
const express = require('express');
var SpotifyWebApi = require('spotify-web-api-node');

var access_token1 = "";
const port = process.env.PORT || 5500; //allow environment to set their own port number or we assign it

//what user data we want to read
const scopes = [
    'user-read-email',
    'user-read-private',
    'playlist-read-private',
    'user-library-read',
    'user-top-read',
    'user-read-recently-played',
  ];

// client credentials 
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'https://ly-fy.herokuapp.com/callback'
  //redirectUri: 'http://localhost:5500/callback'
});

//starting express module
const app = express();
app.use(express.static('public'));

//start listening to assigned port on line 9
app.listen(port, () =>
console.log(
  `HTTP Server up. Now go to http://localhost: ${port} on ur browser`
)
);

//if the user click the button , it will go to /login , and process with spotify login
app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes)); //goto spotify login page
  });

  app.get('/callback', (req, res) => { //once it has been logged in, go to /callback
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
        const access_token = data.body['access_token']; //get access token to use for another API call
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
  
        console.log(typeof(data.body['access_token']));
        access_token1 = data.body['access_token'];

        spotifyApi.setAccessToken(access_token); //set access token
        spotifyApi.setRefreshToken(refresh_token);
  
        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);
  
        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
        console.log('Success! You can now close the window.');
        
        res.redirect('/quiz.html'); //change page to 'quiz'
        
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
