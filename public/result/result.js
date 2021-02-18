$(document).ready(function (){


    document.cookie = "completed=true; max-age=10000; samesite=lax; path=/";
    
    function str_pad_left(string,pad,length) {
        return (new Array(length+1).join(pad)+string).slice(-length);
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
           var c = ca[i];
           while (c.charAt(0)==' ') c = c.substring(1);
           if(c.indexOf(name) == 0)
              return c.substring(name.length,c.length);
        }
        return "";
   }

    var score = getCookie("score");
    var name = getCookie("name");
    var time = getCookie("time");

    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;


    
    var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);

        $('#ur-name').text(`Not bad, ${name}`);
        $('#ur-result').text(`Score: ${score}/10\nTime: ${finalTime} minutes`);
   var twiiterimg = `pic.twitter.com/GOzFUTC7Rl`;
    var link = `https://twitter.com/share?url=http://lrfy-beta.herokuapp.com&text=How%20well%20do%20you%20know%20your%20songs?%20I%20scored%20${score}/10%20${twiiterimg}%20&hashtags=lrfy`;


    $('.share').append(`<a target="_blank" id="shr" href="${link}">Share to twitter</a> <br>`);

    var text_ws = 
`How well do you know your Spotify® musics? 
I scored ${score}/10 and took only ${finalTime} minutes. 
Find out now on *lrfy.*
https://lrfy-beta.herokuapp.com/`;


    $('.share').append(`<a target="_blank" href="whatsapp://send?text=${encodeURIComponent(text_ws)}">Share to WhatsApp</a> <br>`);






});

