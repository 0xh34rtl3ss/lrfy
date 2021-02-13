
var userdata; // stored user data in JSON , call this var to access user data
var userprogress = 0;


    


$(document).ready(function () {

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
        
    function renderQuiz() {



      
         $(".lyrics-box").html(`<p>${userdata.USER.TOPSONGS[(getRandomInt(0,2))][(getRandomInt(0,4))].snippet}</p> <br>`);

        $('.radioss').html(`<form><fieldset id="group1">
            <input type="radio" value="value1" name="group1"> ${userdata.USER.TOPSONGS[(getRandomInt(0,2))][(getRandomInt(0,4))].tracks}
            <input type="radio" value="value2" name="group1"> ${userdata.USER.TOPSONGS[(getRandomInt(0,2))][(getRandomInt(0,4))].tracks}<br>
            <input type="radio" value="value3" name="group1"> ${userdata.USER.TOPSONGS[(getRandomInt(0,2))][(getRandomInt(0,4))].tracks}
            <input type="radio" value="value4" name="group1"> ${userdata.USER.TOPSONGS[(getRandomInt(0,2))][(getRandomInt(0,4))].tracks}
            </fieldset>
            </form>`);

        
        
    }



    /************ START OF BACKEND */


    console.log("ready!");


    getAPI();




    console.log("userprogress: " + userprogress);

    function getAPI() {

        console.log("GET request to server, retrieving API");
        var xhr = $.ajax({
            type: 'GET',
            //url: 'http://localhost:5500/secret',
            url: 'https://lrfy-beta.herokuapp.com/secret',

            beforeSend: function () {
                $('.loader').show();
                $('.content').hide();
            },
            complete: function () {
                $('.loader').hide();
                $('.content').show();
                renderQuiz();
                

            },
            success: function (data) {
                if (typeof data === 'string' || data instanceof String) {
                    xhr.abort();
                    window.location.href = '/error';
                    console.log("its a string");
                } else {
                    console.log("data type: " + typeof (data));
                    console.log("API received!");
                    userdata = data; //copy received data to local var
                    userdata = JSON.parse(JSON.stringify(userdata));

                    xhr.abort();
                    
                    console.log("aborted AJAX to webserver-api");
                    // getLyrics();
                    $('#imgg').append(`<img src=${userdata.USER.image} alt="user_pic">`);
                    $('#username').text(userdata.USER.displayname);
                    for (let index = 0; index < userdata.USER.ALBUMART.length; index++) { //[0] is the the most played songs , and so on..
                        $('.albumcover').append(`<img src=${userdata.USER.ALBUMART[index]} alt=${index} width="200" height="200"> `); //enter width and height here
                    }
                    
                    
                    return;
                    


                }

            },
            error: function (xhr, status, error) {
                window.location.href = '/error';
                return;
            }
        });

        


    }








    /************ END OF BACKEND */




    /********* START OF FRONTEND */
    $('#button').click(function () {

        var userans = $('input[name="group1"]:checked').val(); //get user answer 
        


        console.log("userprogress: " + userprogress);

        if (userprogress < 10) {
            renderQuiz();
            userprogress++;
            $('#answered').text(`${userprogress} / 10`);
        } else {

            document.cookie = "score=10; samesite=lax; path=/";
            window.location.href = '/result';

        }

        console.log(userprogress);
        return;
    });



   





    // add animation while waiting the page to get data from server 
    // 





    /********* END OF FRONTEND */
}); //end window load

