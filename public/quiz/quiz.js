$(document).ready(function () {

    
    console.log("ready!");
    var API_KEY = [];
    var apiready = false;
    var dataready = false;
    var spotifydata = {};
    var userprogress=0;
    getAPI();
    timeout();

    /** bagi masa untuk fetch API_KEY */
    function timeout() {
        setTimeout(function () {
            console.log("ho");
            if (apiready == true && dataready==false) {
                console.log("initiate getSpotifyData()");
                getSpotifyData();
                dataready = true;
            } else if (apiready == true && dataready == true) {
                console.log("initiate getLyrics()");
                getLyrics();
                return;
            }
            timeout();
        }, 1000);
    }

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

        var receivedlyric = false;
        var getsongid = `${endpoint}track.search?format=jsonp&callback=callback&q_track=${song}&q_artist=${artist}&quorum_factor=1&apikey=${API_KEY}`;
        var getlyrics = `${endpoint}track.lyrics.get?format=jsonp&callback=callback&track_id=${songid}&apikey=${API_KEY}`;
        var getsnippet = `${endpoint}track.snippet.get?format=jsonp&callback=callback&track_id=${songid}&apikey=${API_KEY}`;

       var gll =  $.ajax({
            url: getsnippet,
            method: 'get',
            success: function (data) {
                console.log("make ajax call to API");

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
                receivedlyric=true;

            }

        });

        if(receivedlyric==true){
            console.log("aborted AJAX to MusixMatch");
            gll.abort();
        }

    }

    function getAPI() {

        var datareceived = false;
       var xhr = $.ajax({
            type: 'GET',
            //url: 'http://localhost:5500/secret',
            url: 'https://ly-fy.herokuapp.com/secret',
            success: function (data) {
                console.log("GET request to server, retrieving API");
                apiready = true;
                API_KEY.push(data);
                console.log("API received!");
                datareceived=true;
            }
        });

    if(datareceived==true){
            console.log("aborted AJAX to webserver-api");
            xhr.abort();
    }

    }

    function getSpotifyData() {
        var receivedspotify=false;
       var abb =  $.ajax({
            type: 'GET',
           // url: 'http://localhost:5500/data',
            url: 'https://ly-fy.herokuapp.com/data',
            dataType: "json",
            success: function (data) {
                console.log(data);
                spotifydata = data;
                spotifydata.push(data);
                console.log("GET request to server, retrieving sporify data");
                console.log("datas:"+JSON.stringify(spotifydata[0].images[0].url));
                receivedspotify = true;


                $('#imgg').append(`<img src=${JSON.stringify(spotifydata[0].images[0].url)} alt="user_pic">`);
                $('#username').text(JSON.stringify(spotifydata[0].display_name).slice(1,-1));
                

            }
        });

        if(receivedspotify==true){
            console.log("aborted AJAX to webserver-spotify");
            abb.abort();
        }

    }

/************ END OF BACKEND */



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










}); //end window load