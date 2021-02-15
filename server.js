/*
modules initialization
*/
require('dotenv').config()
const express = require('express');
var bodyParser = require('body-parser');
music = require('musicmatch')({
  apikey: `${process.env.API_KEY}`
});
const axios = require('axios').default;
var SpotifyWebApi = require('spotify-web-api-node');
var session = require('express-session');
const path = require('path');
const {
  performance
} = require('perf_hooks');
const { SSL_OP_SINGLE_DH_USE } = require('constants');

var loggedin = false;
var spotifydata = [];
var sess;
var completed = false;

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
app.use(session({
  secret: 'xQc0W',
  resave: false,
  cookie: {
    maxAge: 900000
  },
  saveUninitialized: false,
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());



//start listening to assigned port on line 9
app.listen(port, () =>
  console.log(
    `HTTP Server up. Now go to http://localhost:${port} on ur browser`
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

/*
function validateCookie(req,res,next){

  const { cookies } = req;
  console.log(`masuk validateCookie()`);
  if('session_id' in cookies){
    console.log(`${JSON.stringify(cookies)} existed`); 
    //if(cookies.session_id === '12345') next();
    next();
    //return true;
  }
  else{
    console.log(`sorry, cookies not existed`); 
    res.redirect('/');
    //return false;
  }


}
*/




//if the user click the button , it will go to /login , and process with spotify login
app.get('/login', (req, res) => {

  req.session.authenticated = false;
  req.session.completed = false;
  console.log("");
  console.log("masuk /login");
  console.log("req.session.auth in /login: " + req.session.authenticated);
  console.log("req.session.completed in /login: " + req.session.completed);
  console.log("accesstoken: " + spotifyApi.getAccessToken());

  console.log("");
  console.log("session.id: " + req.session.id);
  console.log("sessionID: " + req.sessionID);
  console.log("");

  if (spotifyApi.getAccessToken() == null) {
    console.log("no acces token , redirect to login page");
    res.redirect(spotifyApi.createAuthorizeURL(scopes)); //goto spotify login page
  } else {
    req.session = null;
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
  }

});

app.get('/callback', (req, res) => { //once it has been logged in, go to /callback
  console.log("");
  console.log("masuk /callback");
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  var id = generateRandomString(16);
  //console.log("\nsession_id: "+id);
  //res.cookie(`session_id`,`${id}`, {httpOnly:true, maxAge:900000,  sameSite: 'lax'}); //cookies set to 15 minutes

  req.session.authenticated = true;
  console.log("req.session.auth in /login: " + req.session.authenticated);



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
      req.redirect('/error');
    });


});


app.get('/error', function (req, res) {
  req.session.destroy();
  console.log("masuk /error");
  console.log("current url: " + req.originalUrl);
  res.sendFile(__dirname + "/public/Error/error.html");
});



//prevent user to implicitly enter quiz without log in
app.get('/quiz', function (req, res) {
  console.log("");
  console.log("masuk /quiz");
  console.log("current url: " + req.originalUrl);
  var url = [];
  var aaa = req.originalUrl.split("/");
  aaa.forEach(function (obj) {
    url.push(obj);
  });
  console.log("req.session.authenticated in /quiz:  " + req.session.authenticated);
  console.log("req.session.completed in /quiz:  " + req.session.completed);

  if (url[2] == '' && req.session.authenticated == true && (req.session.completed == false || req.session.completed == undefined)) {
    console.log("masuk 1");
    return res.sendFile(__dirname + "/public/quiz/quiz.html");
  } else {
    console.log("3");
    return res.redirect('/error');
  }
});




app.get('/result', function (req, res) {
  res.sendFile(__dirname + "/public/result/result.html");
  console.log("");
  console.log("masuk /result")
  console.log("current url: " + req.originalUrl);
  console.log("req.session.authenticated in /result:  " + req.session.authenticated);
  console.log("req.session.completed in /result:  " + req.session.completed);
  req.session.authenticated = false;
  req.session.completed = true;
  req.session.destroy();

  /*
  const { cookies } = req;
  console.log("masuk validateCookie()");
  if('session_id' in cookies){
    console.log(`${JSON.stringify(cookies)} existed`); 
    res.clearCookie('session_id',`${cookies}`);
    req.session = null;
    console.log("access token1: "+spotifyApi.getAccessToken());
    spotifyApi.resetAccessToken(spotifyApi.getAccessToken());
    console.log("access token2: "+spotifyApi.getAccessToken());
    console.log("cookies destroyed");
  }
*/


});




//kalau selain dri allowable route


app.get('/secret', function (req, res) {
  console.log("");
  console.log("masuk /secret");
  console.log("current url: " + req.originalUrl);
  console.log("req.session.authenticated in /secret:  " + req.session.authenticated);
  console.log("req.session.completed in /secret:  " + req.session.completed);
  console.log("loggedin in /secret:  " + loggedin);


  var userid = "";
  var imgurl = "";
  var topalbum = [];
  var topsongs_s = [];
  var topsongs_s2 = [];
  var topsongs_m = [];
  var topsongs_l = [];
  var debug = true; //change to false when want to debug(skip the process)




  /*
  if( req.session.completed == undefined && req.session.authenticated == undefined && loggedin==true ){
    console.log("current url1: "+ req.originalUrl);
    return res.redirect('/quiz');
    console.log("current url2: "+ req.originalUrl);
  }
*/
  if (debug == true && loggedin == true && req.session.authenticated == true && (req.session.completed == false || req.session.completed == undefined)) {
    var t0 = performance.now()







    // Get the authenticated user
    spotifyApi.getMe()
      .then(function (data) {

        // console.log('Some information about the authenticated user', data.body);
        userid = data.body.display_name;
        imgurl = data.body.images[0].url;
        //console.log(userid);
        // console.log(imgurl);

      }, function (err) {
        console.log('Something went wrong!', err);
      }).then(function () {

        //get user saved tracks
        spotifyApi.getMyTopTracks({
            limit: 50,
            offset: 0,
            time_range: 'short_term'
          })
          .then(function (data) {
            topsongs_s = data.body.items;
            for (var i = 0; i < 20; i++) {
              var albumurl = data.body.items[i].album.images[0].url;
              if (topalbum.includes(albumurl, 0) == true) {} else {
                topalbum.push(albumurl);

              }

            }

            console.log('Done!');

          }, function (err) {
            console.log('Something went wrong!', err);
          })
          .then(async function () {


            for (let index = 0; index < 5; index++) {

              // use try/catch for error handling
              try {
                var songName = topsongs_s[index].name;
                var artistName = topsongs_s[index].artists[0].name;

                // call synchronously and wait for the response
                const data = await music.artistSearch({
                  q_artist: artistName, //pass the artist name 
                  page: 1
                });

                var artist_ID = data.message.body.artist_list[0].artist.artist_id;

                if (data.message.body.artist_list[0].artist.artist_name == artistName) { //same artist name

                  var obj = {}; //create objects to push on array
                  obj['tracks'] = songName;
                  obj['artist'] = artistName;
                  obj['artistID'] = artist_ID;
                  obj['trackID'] = '';
                  obj['snippet'] = '';
                  topsongs_s2.push(obj); //push tht objects 

                  try {
                    var songName = topsongs_s2[index].tracks;
                    var artistName = topsongs_s2[index].artist;

                    // call synchronously and wait for the response
                    const data = await music.trackSearch({
                      q_track: songName,
                      q_artist: artistName,
                      f_has_lyrics: true,
                      f_artist_id: topsongs_s2[index].artistID,
                      s_track_rating: 'desc',
                      s_artist_rating: 'desc',
                      page: 1,
                    })

                    const result = await music.trackSnippet({
                      track_id: data.message.body.track_list[0].track.track_id,
                    })


                    var trackID = data.message.body.track_list[0].track.track_id;
                    var snippet = result.message.body.snippet.snippet_body
                    console.log("tracks: " + songName + "   artist: " + artistName);
                    console.log("artistID: " + topsongs_s2[index].artistID);
                    console.log("trackid: " + trackID);
                    console.log("snippet: " + snippet);

                    topsongs_s2[index].trackID = trackID;
                    topsongs_s2[index].snippet = snippet;
                    console.log();

                  } catch (error) {
                    console.error(error);
                  }


                } else {
                  //do nothing , not creating object
                }

              } catch (error) {
                console.error(error);
              }
            }

          })

          .then(async function () {
            console.log("--------------------MEDIUM TERM--------------------");
            spotifyApi.getMyTopTracks({
                limit: 50,
                offset: 0,
                time_range: 'medium_term'
              })

              .then(async function (data) {



                  var songcounter = 0;
                  var currentindex = 0;
                  var dummysongs = 0;
                  do {


                    var songName = data.body.items[currentindex].name;
                    var artistName = data.body.items[currentindex].artists[0].name;

                    const found = topsongs_s2.some(item => item.tracks === songName);
                    if (found) { //found same song name
                      console.log(songName + " existed! \nSkipped!\n");
                      currentindex++;
                      continue;

                    } else {

                      if(songcounter<5){

                      try {

                        const data0 = await music.artistSearch({
                          q_artist: artistName, //pass the artist name 
                          page: 1
                        });

                        var artist_ID = data0.message.body.artist_list[0].artist.artist_id;

                        if (data0.message.body.artist_list[0].artist.artist_name.toLowerCase() == artistName.toLowerCase()) {

                          const data1 = await music.trackSearch({
                            q_track: songName,
                            q_artist: data0.message.body.artist_list[0].artist.artist_name,
                            f_has_lyrics: true,
                            f_artist_id: data0.message.body.artist_list[0].artist.artist_id,
                            s_track_rating: 'desc',
                            s_artist_rating: 'desc',
                            page: 1,
                          })

                          const result = await music.trackSnippet({
                            track_id: data1.message.body.track_list[0].track.track_id
                          })

                          console.log("tracks: " + songName + "   artist: " + artistName);
                          console.log("artistID: " + data0.message.body.artist_list[0].artist.artist_id);
                          console.log("trackid: " + data1.message.body.track_list[0].track.track_id);
                          console.log("snippet: " + result.message.body.snippet.snippet_body);

                          var obj = {};
                          obj['tracks'] = songName;
                          obj['artist'] = artistName;
                          obj['artistID'] = artist_ID;
                          obj['trackID'] = data1.message.body.track_list[0].track.track_id;
                          obj['snippet'] = result.message.body.snippet.snippet_body;
                          topsongs_m.push(obj);

                          currentindex++;
                          songcounter++;
                          console.log("songcounter: " + songcounter);
                          console.log();



                        } else {
                          console.log("artist name mistmatch!");
                          currentindex++;
                          console.log(data0.message.body.artist_list[0].artist.artist_name.toLowerCase() + " != " + artistName.toLowerCase());
                        }



                      } catch (error) {
                        currentindex++;
                        // console.error(error);
                      }
                        }

                        else{
                          console.log("appending other remaining songs ");
                          var obj = {};
                          obj['tracks'] = songName;
                          obj['artist'] = artistName;
                          topsongs_m.push(obj);
                          dummysongs++;

                          currentindex++;
                          console.log("tracks: "+songName+"\nartist: "+artistName);
                          console.log("current index: " + currentindex);
                          console.log();

                        }

                    }

                  } while (currentindex < 50 && dummysongs<15);










                },
                function (err) {
                  console.log('Something went wrong!', err);
                })
              /**************** LONG  */
              .then(async function () {

                console.log("--------------------LONG TERM--------------------");
                spotifyApi.getMyTopTracks({
                    limit: 50,
                    offset: 0,
                    time_range: 'long_term'
                  })

                  .then(async function (data) {



                      var songcounter = 0;
                      var currentindex = 0;
                      var dummysongs =0;
                      do {
                        var songName = data.body.items[currentindex].name;
                        var artistName = data.body.items[currentindex].artists[0].name;

                        const found = topsongs_s2.some(item => item.tracks === songName);
                        const found2 = topsongs_m.some(item => item.tracks === songName);
                        if (found == true || found2 == true) { //found same song name
                          console.log(songName + " existed! \nSkipped!\n");
                          currentindex++;
                          continue;

                        } else {
                          
                          if(songcounter<5){

                          try {

                            const data0 = await music.artistSearch({
                              q_artist: artistName, //pass the artist name 
                              page: 1
                            });

                            var artist_ID = data0.message.body.artist_list[0].artist.artist_id;

                            if (data0.message.body.artist_list[0].artist.artist_name.toLowerCase() == artistName.toLowerCase()) {

                              const data1 = await music.trackSearch({
                                q_track: songName,
                                q_artist: data0.message.body.artist_list[0].artist.artist_name,
                                f_has_lyrics: true,
                                f_artist_id: data0.message.body.artist_list[0].artist.artist_id,
                                s_track_rating: 'desc',
                                s_artist_rating: 'desc',
                                page: 1,
                              })

                              const result = await music.trackSnippet({
                                track_id: data1.message.body.track_list[0].track.track_id
                              })

                              console.log("tracks: " + songName + "   artist: " + artistName);
                              console.log("artistID: " + data0.message.body.artist_list[0].artist.artist_id);
                              console.log("trackid: " + data1.message.body.track_list[0].track.track_id);
                              console.log("snippet: " + result.message.body.snippet.snippet_body);

                              var obj = {};
                              obj['tracks'] = songName;
                              obj['artist'] = artistName;
                              obj['artistID'] = artist_ID;
                              obj['trackID'] = data1.message.body.track_list[0].track.track_id;
                              obj['snippet'] = result.message.body.snippet.snippet_body;
                              topsongs_l.push(obj);

                              currentindex++;
                              songcounter++;
                              console.log("songcounter: " + songcounter);
                              console.log();



                            } else {
                              console.log("artist name mistmatch!");
                              currentindex++;
                              console.log(data0.message.body.artist_list[0].artist.artist_name.toLowerCase() + " != " + artistName.toLowerCase());
                            }



                          } catch (error) {
                            currentindex++;
                            // console.error(error);
                          }
                            }
    
                            else{
                              console.log("appending other remaining songs ");
                              var obj = {};
                              obj['tracks'] = songName;
                              obj['artist'] = artistName;
                              topsongs_l.push(obj);
                              dummysongs++;
    
                              currentindex++;
                              console.log("tracks: "+songName+"\nartist: "+artistName);
                              console.log("current index: " + currentindex);
                              console.log();
    
                            }
    
                        }
    
                      } while (currentindex < 50 && dummysongs<15);






                    },
                    function (err) {
                      console.log('Something went wrong!', err);
                    }).then(function () {
                    var t1 = performance.now()
                    console.log("fetch user info and tracks took " + ((t1 - t0) / 1000) + " seconds.")
                    senddata(); ////////////////////////////////////////////////////////////////////////////
                  }, function (err) {
                    console.log('Something went wrong!', err);
                  });
              });

          });


      });

  } //end if
  else {
    //res.redirect("/error"); uncomnnet this after finsihg debug
    senddata(); //debug only !!1
  }



  function senddata() {
   // var data = {"USER":{"displayname":"me?ran","image":"https://i.scdn.co/image/ab6775700000ee8500f6d1d8d8b9b30a342a0414","ALBUMART":["https://i.scdn.co/image/ab67616d0000b2739b6ac98a52f62d5cb473da40","https://i.scdn.co/image/ab67616d0000b273cda2c6ad6272aea9c5811a49","https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163","https://i.scdn.co/image/ab67616d0000b27378f71c0d2fe34592a3c18f80","https://i.scdn.co/image/ab67616d0000b273cc2cf912462d8ae4ef856434","https://i.scdn.co/image/ab67616d0000b2733066581d697fbdee4303d685","https://i.scdn.co/image/ab67616d0000b2736c20c4638a558132ba95bc39","https://i.scdn.co/image/ab67616d0000b273b52b8bb89adb452a75a042af","https://i.scdn.co/image/ab67616d0000b273466f56d5f68eec9b0866e894","https://i.scdn.co/image/ab67616d0000b27356f4dd4f29ddc5f65c70b664","https://i.scdn.co/image/ab67616d0000b27333a859e36fdc9a27ed86516e","https://i.scdn.co/image/ab67616d0000b2738fa2900c5870c43c27a2cf5e","https://i.scdn.co/image/ab67616d0000b2731121a528557155240feb9273","https://i.scdn.co/image/ab67616d0000b27390e0df2bbc53b15ea320e30e","https://i.scdn.co/image/ab67616d0000b27352b2a3824413eefe9e33817a","https://i.scdn.co/image/ab67616d0000b2733552d3f419afe41cf9b0bd0a","https://i.scdn.co/image/ab67616d0000b2730c923eca53e52135ffb60c5d","https://i.scdn.co/image/ab67616d0000b273dfb3ec8a83a71cd5bbc595e6"],"TOPSONGS":[[{"tracks":"Nervous","artist":"The Neighbourhood","artistID":484057,"trackID":145900361,"snippet":"Hush, baby, don't you say another word"},{"tracks":"Physical","artist":"Dua Lipa","artistID":33491593,"trackID":194285001,"snippet":"All night, I'll riot with you"},{"tracks":"I Wanna Be Yours","artist":"Arctic Monkeys","artistID":145181,"trackID":82923045,"snippet":"I just wanna be yours (Wanna be yours)"},{"tracks":"Sweater Weather","artist":"The Neighbourhood","artistID":484057,"trackID":35336369,"snippet":"'Cause it's too cold, woah"},{"tracks":"American Money","artist":"BØRNS","artistID":28282509,"trackID":83950112,"snippet":"So take me to the paradise"}],[{"tracks":"Take Yourself Home","artist":"Troye Sivan","artistID":14149880,"trackID":204380567,"snippet":"I'm tired of the city, scream if you're with me"},{"tracks":"Friends","artist":"Chase Atlantic","artistID":28069614,"trackID":81193551,"snippet":"All of your friends have been here for too long"},{"tracks":"Gimme Love","artist":"Joji","artistID":25755232,"trackID":202866546,"snippet":"When I'm gone, when I'm gone"},{"tracks":"Electric Love","artist":"BØRNS","artistID":28282509,"trackID":83950111,"snippet":"Baby, you're like lightning in a bottle"},{"tracks":"Style","artist":"Taylor Swift","artistID":259675,"trackID":73446913,"snippet":"And when we go crashing down we come back every time"},{"tracks":"Tongue Tied","artist":"Grouplove"},{"tracks":"Paramedic!","artist":"SOB X RBE"},{"tracks":"POSTERITY","artist":"Ludwig Goransson"},{"tracks":"Still Don't Know My Name","artist":"Labrinth"},{"tracks":"Right Here","artist":"Chase Atlantic"},{"tracks":"Golden","artist":"Harry Styles"},{"tracks":"As Long As You Love Me","artist":"Justin Bieber"},{"tracks":"Take Yourself Home","artist":"Troye Sivan"},{"tracks":"Dancing With Our Hands Tied","artist":"Taylor Swift"},{"tracks":"Weaver Ants","artist":"Epic Mountain"},{"tracks":"Flames (feat. Ruel)","artist":"SG Lewis"},{"tracks":"Electricity (with Dua Lipa)","artist":"Silk City"},{"tracks":"Opps (with Yugen Blakrok)","artist":"Vince Staples"},{"tracks":"Daddy Issues","artist":"The Neighbourhood"},{"tracks":"Stunnin' (feat. Harm Franklin)","artist":"Curtis Waters"}],[{"tracks":"everything i wanted","artist":"Billie Eilish","artistID":29247465,"trackID":187632922,"snippet":"But when I wake up, I see"},{"tracks":"What A Heavenly Way To Die","artist":"Troye Sivan","artistID":14149880,"trackID":166651209,"snippet":"I wanna spend with you"},{"tracks":"Save That Shit","artist":"Lil Peep","artistID":30969919,"trackID":132750089,"snippet":"Nothin' like them other motherfuckers"},{"tracks":"Youngblood","artist":"5 Seconds of Summer","artistID":14354654,"trackID":148708644,"snippet":"Say you want me, say you want me out of your life"},{"tracks":"FOOLS","artist":"Troye Sivan","artistID":14149880,"trackID":113740102,"snippet":"Only fools do what I do"},{"tracks":"Swan Song - From the Motion Picture \"Alita: Battle Angel\"","artist":"Dua Lipa"},{"tracks":"Goodbyes (feat. Young Thug)","artist":"Post Malone"},{"tracks":"Delicate","artist":"Taylor Swift"},{"tracks":"TALK ME DOWN","artist":"Troye Sivan"},{"tracks":"Myself","artist":"Post Malone"},{"tracks":"Lie To Me (feat. Julia Michaels)","artist":"5 Seconds of Summer"},{"tracks":"Cruel Summer","artist":"Taylor Swift"},{"tracks":"It Will Rain","artist":"Bruno Mars"},{"tracks":"End Game","artist":"Taylor Swift"},{"tracks":"My My My!","artist":"Troye Sivan"},{"tracks":"Take What You Want (feat. Ozzy Osbourne & Travis Scott)","artist":"Post Malone"},{"tracks":"Painkiller","artist":"Ruel"},{"tracks":"lost","artist":"Loote"},{"tracks":"Trampoline (with ZAYN)","artist":"SHAED"},{"tracks":"HEAVEN","artist":"Troye Sivan"}]]}};
      
    
    var data = {
      "USER": {
        "displayname": `${userid}`,
        "image": `${imgurl}`,
        "ALBUMART": topalbum,
        "TOPSONGS": [ topsongs_s2,topsongs_m,topsongs_l]
      }

    };
    


    console.log(data.USER.TOPSONGS[0]);
    console.log(data.USER.TOPSONGS[1]);
    console.log(data.USER.TOPSONGS[2]);
    res.send(data);

    
    
    
    //res.send(JSON.parse(JSON.stringify(data))); // UNCOMMMNET THOOS
  }



});

app.get('/*', function (req, res) {
  console.log(req.url);
  console.log("masuk /*");
  res.sendFile(__dirname + "/public/Error/error.html");
});

//DELETE LATER
app.post('/endpoint', function (req, res) {
  var obj = {};
  console.log('body: ' + JSON.stringify(req.body));
});