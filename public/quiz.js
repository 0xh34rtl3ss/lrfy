$( document ).ready(function() {
    console.log( "ready!" );


var API_KEY=process.env.API_KEY;
var endpoint = 'https://api.musixmatch.com/ws/1.1/';
var track_id = '';
var ajaxResult=[];

/* test values */
var song = 'I Wanna Be Yours';
var artist = 'Artic Monkeys';
var songid = 82923045; //i wanna be yours

song=song.replace(/ /g,"%20");
artist=artist.replace(/ /g,"%20");

console.log(song);
console.log(artist);


var getsongid = `https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_track=${song}&q_artist=${artist}&quorum_factor=1&apikey=${API_KEY}`;
var getlyrics = `https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=${songid}&apikey=${API_KEY}`;
var getsnippet = `https://api.musixmatch.com/ws/1.1/track.snippet.get?format=jsonp&callback=callback&track_id=${songid}&apikey=${API_KEY}`;


//find songid based on title
$.ajax({
    url: getsnippet,
    method: 'get',
    success: function(data){

        result = data.replace("callback(","");
        result  = result.replace(");","");
        console.log(typeof(result));
        //console.log(result);
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



function otherJsfunc()
 {
  console.log(ajaxResult); 
 }




});