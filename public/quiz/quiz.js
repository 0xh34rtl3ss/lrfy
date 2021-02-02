$(document).ready(function () {


/************ START OF BACKEND */
    console.log("ready!");
    var API_KEY = [];
    var apiready = false;
    var spotifydata = {};
    var userprogress=0;
    getAPI();


    var endpoint = 'https://api.musixmatch.com/ws/1.1/';
    var track_id = '';
    var ajaxResult = [];

    /* test values */
    var song = 'I Wanna Be Yours';
    var artist = 'Artic Monkeys';
    var songid = 82923045; //i wanna be yours

    song = song.replace(/ /g, "%20");
    artist = artist.replace(/ /g, "%20");



    //find songid based on title
    function getLyrics() {

        var getsongid = `${endpoint}track.search?format=jsonp&callback=callback&q_track=${song}&q_artist=${artist}&quorum_factor=1&apikey=${API_KEY}`;
        var getlyrics = `${endpoint}track.lyrics.get?format=jsonp&callback=callback&track_id=${songid}&apikey=${API_KEY}`;
        var getsnippet = `${endpoint}track.snippet.get?format=jsonp&callback=callback&track_id=${songid}&apikey=${API_KEY}`;

       var gll =  $.ajax({
            url: getsnippet,
            method: 'get',
            success: function (data) {
                console.log("make ajax call to Musixmatch API");

                result = data.replace("callback(", "");
                result = result.replace(");", "");
                // console.log(result);
                result = JSON.parse(result);

                /* FOR LYRICS */
                /*
                lyrics = JSON.stringify(result.message.body.lyrics.lyrics_body).replace(/['"]+/g, '').replace(/\n/g, '<br />');

                console.log(lyrics);
                console.log(typeof(lyrics));

                $('#lyrics').html(lyrics);
                */
                lyrics = JSON.stringify(result.message.body.snippet.snippet_body);
                console.log(lyrics);
                $('#lyrics').html(lyrics);
                gll.abort();
                console.log("aborted AJAX to MusixMatch");

            }

        });

    }



    function getAPI() {

       var xhr = $.ajax({
            type: 'GET',
            //url: 'http://localhost:5500/secret',
            url: 'https://ly-fy.herokuapp.com/secret',
            success: function (data) {
                console.log("GET request to server, retrieving API");
                apiready = true;
                console.log(data);
                API_KEY.push(data.API);
                $('#imgg').append(`<img src=${data.USER.image} alt="user_pic">`);
                $('#username').text(data.USER.displayname);
                console.log("API received!");
                xhr.abort();
                console.log("aborted AJAX to webserver-api");
                getLyrics();
            }
        });


    }
/************ END OF BACKEND */




/********* START OF FRONTEND */
$('#button').click(function () {

    if(userprogress<10){
        userprogress++;
        $('#answered').text(`${userprogress} / 10`);
    }

    else{

        window.location.href = '/result' ;

    }

    console.log(userprogress);
});

/********* END OF FRONTEND */










}); //end window load