$(document).ready(function () {


    document.cookie = "completed=true; max-age=10000; samesite=lax; path=/";

    function str_pad_left(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0)
                return c.substring(name.length, c.length);
        }
        return "";
    }

    var score = getCookie("score");
    var name = getCookie("name");
    var time = getCookie("time");

    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;



    var finalTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);

    $('#ur-name').text(`Not bad, ${name}`);
    $('#ur-result').text(`Score: ${score}/10\nTime: ${finalTime} minutes`);

    var text_twt =
        `How%20well%20do%20you%20know%20your%20Spotify%C2%AE%20musics%3F%20%0AI%20scored%20${score}%2F10%20and%20took%20only%20${str_pad_left(minutes,'0',2)}%3A${str_pad_left(seconds,'0',2)}%20minutes.%20%0AFind%20out%20now%20on%20%23lrfy%0A`
    var link = `https://twitter.com/share?text=${text_twt}&url=http://lrfy-beta.herokuapp.com`;


    $('.share').append(`<a target="_blank" id="shr" href="${link}">Share to twitter</a> <br>`);

    var text_ws =
        `How well do you know your Spotify® musics? 
I scored ${score}/10 and took only ${finalTime} minutes. 
Find out now on *lrfy.*
https://lrfy-beta.herokuapp.com/`;


    $('.share').append(`<a target="_blank" href="whatsapp://send?text=${encodeURIComponent(text_ws)}">Share to WhatsApp</a> <br>`);


    document.cookie = "score= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "name= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "time= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";


    var data = {};
    data.title = "title";
    data.message = "message";

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        //url: 'http://localhost:5500/endpoint',
        url: 'https://lrfy-beta.herokuapp.com/endpoint',
        success: function (data) {
            console.log('success');
            console.log(JSON.stringify(data));
        }
    });






});