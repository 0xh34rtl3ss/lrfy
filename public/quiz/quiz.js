$(document).ready(function () {
    console.log("ready!");
    var API_KEY = [];
    var apiready = false;
    getAPI();
    timeout();



/** bagi masa untuk fetch API_KEY */
    function timeout() {
        setTimeout(function () {
            console.log("ho");
            if(apiready==true){
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

    function getLyrics(){

        var getsongid = `${endpoint}track.search?format=jsonp&callback=callback&q_track=${song}&q_artist=${artist}&quorum_factor=1&apikey=${API_KEY}`;
        var getlyrics = `${endpoint}track.lyrics.get?format=jsonp&callback=callback&track_id=${songid}&apikey=${API_KEY}`;
        var getsnippet = `${endpoint}track.snippet.get?format=jsonp&callback=callback&track_id=${songid}&apikey=${API_KEY}`;
    
    $.ajax({
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

        }

    });

    }

    function getAPI(){

    $.ajax({
        type: 'GET',
        //url: 'http://localhost:5500/secret',
        url: 'https://ly-fy.herokuapp.com/secret',
        success: function(data) {
            console.log("GET request to server, retrieving API");
            apiready= true;
            API_KEY.push(data);
        }
    });


    }

    $('#submit').click(function () {

        var data = {};
        data.title = "title";
        data.message = "message";
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'https://ly-fy.herokuapp.com/endpoint',
            //url: 'http://localhost:5500/endpoint',						
            success: function(data) {
                console.log('success data sent from quiz.js ! , check ur server terminal');
                console.log(JSON.stringify(data));
            }
        });

    });






});