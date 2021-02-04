/*
modules initialization
*/
require('dotenv').config()
const express = require('express');
var bodyParser = require('body-parser');
const axios = require('axios').default;
var SpotifyWebApi = require('spotify-web-api-node');
var cookieParser = require('cookie-parser');
const path = require('path');

var loggedin = false;
var spotifydata = [];
var sess;

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
  redirectUri: 'https://lrfy-beta.herokuapp.com/callback'
  //redirectUri: 'http://localhost:5500/callback'
});

//starting express module
var app = express();
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());



//start listening to assigned port on line 9
app.listen(port, () =>


  console.log(
    `HTTP Server up. Now go to http://localhost: ${port} on ur browser`
  )
);

var generateRandomString = function (length) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

function validateCookie(req,res,next){

  const { cookies } = req;
  console.log("masuk validateCookie()");
  if('session_id' in cookies){
    console.log(`${JSON.stringify(cookies)} existed`); 
    //if(cookies.session_id === '12345') next();
    next();
    //return true;
  }
  else{
    console.log(`sorry, ${JSON.stringify(cookies)} not existed`); 
    res.redirect('/');
    //return false;
  }


}



//if the user click the button , it will go to /login , and process with spotify login
app.get('/login',  (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes)); //goto spotify login page
  
});

app.get('/callback', (req, res) => { //once it has been logged in, go to /callback
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  var id = generateRandomString(16);
  console.log("\nsession_id: "+id);
  res.cookie(`session_id`,`${id}`, {httpOnly:true, maxAge:900000,  sameSite: 'lax'}); //cookies set to 15 minutes
 


  if (error) {
    console.error('Callback Error:', error);
    res.session.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token']; //get access token to use for another API call
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      //access_token1 = data.body['access_token'];

      spotifyApi.setAccessToken(access_token); //set access token
      spotifyApi.setRefreshToken(refresh_token);

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
       loggedin = true;
      console.log("\n");
      if (loggedin == true) {
        console.log("loggedin = true ")
        res.redirect("/quiz"); //change page to 'quiz'
      } else {
        console.log("loggedin = false ")
        res.redirect("/");
      }
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



//prevent user to implicitly enter quiz without log in
app.get('/quiz', function  (req, res)  {

  console.log("masuk /quiz");

  if(loggedin==true){
    res.sendFile(__dirname + "/public/quiz/quiz.html");
  }  
  else{
    console.log("3");
    res.redirect('/error');
  }
});


app.get('/result', validateCookie, (req, res) => {
  console.log("masuk /result")
  res.sendFile(__dirname + "/public/result/result.html");

  const { cookies } = req;
  console.log("masuk validateCookie()");
  if('session_id' in cookies){
    console.log(`${JSON.stringify(cookies)} existed`); 
    res.clearCookie('session_id',`${cookies}`);
    console.log("cookies destroyed");
  }

  
  
});

app.get('/error', function(req,res) {
  res.sendFile(__dirname + "/public/Error/error.html");
});


/*
  //kalau selain dri allowable route
app.get('/*', function (req, res) { 
  console.log(req.url);
  console.log("masuk /*");
    res.sendFile(__dirname + "/public/Error/error.html");
});
*/


app.get('/secret', validateCookie, (req, res) => {
  console.log("masuk /secret");

  var getdata = false;
  var userid = "";
  var imgurl = "";

  function timeout() {
    setTimeout(function () {
      console.log("ready to send data to client");
      if (getdata == true) {
        senddata();
        //console.log("data saved on spotifydata:   " + spotifydata);
       // res.send(spotifydata);

        return;
      }
      timeout();
    }, 1000);
  }

  do{

  if (loggedin == true) {

    // Get the authenticated user
    spotifyApi.getMe()
      .then(function (data) {

       // console.log('Some information about the authenticated user', data.body);
        userid = data.body.id;
        imgurl = data.body.images[0].url;
        console.log(userid);
        console.log(imgurl);

      }, function (err) {
        console.log('Something went wrong!', err);
      })/*.then(function(){

        //get user playlist
        spotifyApi.getUserPlaylists(userid)
          .then(function (data) {
            console.log('Retrieved playlists', data.body);
          }, function (err) {
            console.log('Something went wrong!', err);
          });

      })*/.then(function(){
          //get user saved tracks
          spotifyApi.getMySavedTracks({
            limit : 2,
            offset: 1
          })
          .then(function(data) {
           // console.log(JSON.stringify(data.body.items[1]));
           // spotifydata.push(data.body.items[1]);
            console.log('Done!');
          }, function(err) {
            console.log('Something went wrong!', err);
          });

      });

      getdata=true;
      timeout();

  } 
  else {
    res.redirect("/");
  }

}while(getdata==false);

function senddata(){
  console.log("data sent!");
  var data = {
    "MM_API": `${process.env.API_KEY}`,
    "USER": {
          "displayname": `${userid}`,
          "image": `${imgurl}`
      }
  };


  console.log(data);
  res.send(data);
}



});

//DELETE LATER
app.post('/endpoint', function (req, res) {
  var obj = {};
  console.log('body: ' + JSON.stringify(req.body));
});