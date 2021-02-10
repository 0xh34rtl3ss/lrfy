$(document).ready(function () {


/************ START OF BACKEND */


    console.log("ready!");
    var API_KEY;
    var userdata; // stored user data in JSON , call this var to access user data
    var userprogress=0;
   
    getAPI();



    
    console.log("userprogress: "+ userprogress);

    var track_id = '';
    var ajaxResult = [];

    /* test values */
   // var song = 'I Wanna Be Yours';
   // var artist = 'Artic Monkeys';
    var songid = 82923045; //i wanna be yours

    //song = song.replace(/ /g, "%20");
    //artist = artist.replace(/ /g, "%20");

    function getAPI() {

    console.log("GET request to server, retrieving API");
       var xhr = $.ajax({
            type: 'GET',
            //url: 'http://localhost:5500/secret',
            url: 'https://lrfy-beta.herokuapp.com/secret',

            beforeSend: function(){
                $('.loader').show();
                $('.content').hide();
            },
            complete: function(){
                $('.loader').hide();
                $('.content').show();

            },
            success: function (data) {
                if(typeof data === 'string' || data instanceof String){
                    xhr.abort();
                    window.location.href = '/error' ;
                    console.log("its a string");
                }
                else{
                console.log("data type: " + typeof(data));
                console.log("API received!");
                userdata = data; //copy received data to local var
                console.log(userdata);
                API_KEY = userdata.MM_API;
                
                xhr.abort();
                console.log("aborted AJAX to webserver-api");
               // getLyrics();
                $('#imgg').append(`<img src=${userdata.USER.image} alt="user_pic">`);
                $('#username').text(userdata.USER.displayname);
                for (let index = 0; index < userdata.USER.ALBUMART.length; index++) { //[0] is the the most played songs , and so on..
                    $('.albumcover').append(`<img src=${userdata.USER.ALBUMART[index]} alt=${index} width="300" height="300"> `); //enter width and height here
                }


             }
                
            },
            error: function(xhr, status, error) {
                window.location.href = '/error' ;
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

