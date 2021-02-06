$(document).ready(function () {


/************ START OF BACKEND */


    console.log("ready!");
    var API_KEY = [];
    var apiready = false;
    var spotifydata = {};
    var userprogress=0;
   
    getAPI();



    
    console.log("userprogress: "+ userprogress);




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

    console.log("GET request to server, retrieving API");
       var xhr = $.ajax({
            type: 'GET',
            //url: 'http://localhost:5500/secret',
            url: 'https://lrfy-beta.herokuapp.com/secret',
            success: function (data) {
                if(typeof data === 'string' || data instanceof String){
                    xhr.abort();
                    window.location.href = '/error' ;
                    console.log("its a string");
                }
                else{
                console.log("data type: " + typeof(data));
                console.log("API received!");
                apiready = true;
                console.log(data);
                API_KEY.push(data.MM_API);
                xhr.abort();
                console.log("aborted AJAX to webserver-api");
                getLyrics();
                $('#imgg').append(`<img src=${data.USER.image} alt="user_pic">`);
                $('#username').text(data.USER.displayname);
                console.log("length: "+ data.USER.ALBUMART.length);

                for (let index = 0; index < data.USER.ALBUMART.length; index++) { //[0] is the the most played songs , and so on..
                    $('.albumcover').append(`<img src=${data.USER.ALBUMART[index]} alt=${index} width="300" height="300"> `); //enter width and height here
                }

            }
                
            }
        });


    }
/************ END OF BACKEND */




/********* START OF FRONTEND */
$('#button').click(function () {

    var userans = $('input[name="group1"]:checked').val(); //get user answer 
    console.log(userans); //

    console.log("userprogress: "+ userprogress);

    if(userprogress<10){
        userprogress++;
        $('#answered').text(`${userprogress} / 10`);
    }

    else{

        document.cookie = "score=10; samesite=lax; path=/";
        window.location.href = '/result' ;

    }

    console.log(userprogress);
});



// add animation while waiting the page to get data from server 
// 





/********* END OF FRONTEND */










}); //end window load

