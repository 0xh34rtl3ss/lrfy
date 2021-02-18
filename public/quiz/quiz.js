var userdata; // stored user data in JSON , call this var to access user data
var userprogress = 0;
var quiz = [];
var usercorrect = 0;
var time0;
var currtime;
var time1;





$(document).ready(function () {

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function renderQuiz(progress) {

        
        
        $('#answered').text(`${userprogress+1} / 10`);
        $(".lyrics-box").html(`<p>${quiz[progress].question}</p> <br>`);

        $('#choice-track1').text(quiz[progress].choice1[0]);
        $('#choice-artist1').text(quiz[progress].choice1[1]);

        $('#choice-track2').text(quiz[progress].choice2[0]);
        $('#choice-artist2').text(quiz[progress].choice2[1]);

        $('#choice-track3').text(quiz[progress].choice3[0]);
        $('#choice-artist3').text(quiz[progress].choice3[1]);

        $('#choice-track4').text(quiz[progress].choice4[0]);
        $('#choice-artist4').text(quiz[progress].choice4[1]);


    }

    function generateQuiz() {
        var x=0;
        do{
        var trueans = getRandomInt(1,4);
       // var trueans = 1;
        var num1 = getRandomInt(0,2);
        var num2 = getRandomInt(0,4);
        const found = quiz.some(item => item.question === userdata.USER.TOPSONGS[num1][num2].snippet);
        if(found){
            continue;
        }
        else{
        
        var obj = {};
        switch(trueans){
            case 1: {
                var numbers = [];
            do{
                var obj1 = {};
                var no1 = getRandomInt(0,2);
                var no2 = getRandomInt(5,19);
                obj1['no1'] = no1;
                obj1['no2'] = no2;
                const found2 = numbers.some(item => (item.no1 === no1 && item.no2 === no2) || (no1==num1 && no2==num2));
                if(found2){
                }
                else{
                    numbers.push(obj1);
                }
            }while(numbers.length < 3);
            
            
            obj['question'] = userdata.USER.TOPSONGS[num1][num2].snippet;
            obj['choice1'] = [userdata.USER.TOPSONGS[num1][num2].tracks,userdata.USER.TOPSONGS[num1][num2].artist];
            obj['choice2'] = [userdata.USER.TOPSONGS[numbers[0].no1][numbers[0].no2].tracks,userdata.USER.TOPSONGS[numbers[0].no1][numbers[0].no2].artist];  
            obj['choice3'] = [userdata.USER.TOPSONGS[numbers[1].no1][numbers[1].no2].tracks,userdata.USER.TOPSONGS[numbers[1].no1][numbers[1].no2].artist];
            obj['choice4'] = [userdata.USER.TOPSONGS[numbers[2].no1][numbers[2].no2].tracks,userdata.USER.TOPSONGS[numbers[2].no1][numbers[2].no2].artist];
            obj['answer'] = 1;
            quiz.push(obj);  x++; break;}

            case 2: {
                var numbers = [];
                do{
                    var obj1 = {};
                    var no1 = getRandomInt(0,2);
                    var no2 = getRandomInt(5,19);
                    obj1['no1'] = no1;
                    obj1['no2'] = no2;
                    const found2 = numbers.some(item => (item.no1 === no1 && item.no2 === no2) || (no1==num1 && no2==num2));
                    if(found2){
                    }
                    else{
                        numbers.push(obj1);
                    }
                }while(numbers.length < 3);

            obj['question'] = userdata.USER.TOPSONGS[num1][num2].snippet;
            obj['choice1'] = [userdata.USER.TOPSONGS[numbers[0].no1][numbers[0].no2].tracks,userdata.USER.TOPSONGS[numbers[0].no1][numbers[0].no2].artist];  
            obj['choice2'] = [userdata.USER.TOPSONGS[num1][num2].tracks,userdata.USER.TOPSONGS[num1][num2].artist];
            obj['choice3'] = [userdata.USER.TOPSONGS[numbers[1].no1][numbers[1].no2].tracks,userdata.USER.TOPSONGS[numbers[1].no1][numbers[1].no2].artist];  
            obj['choice4'] = [userdata.USER.TOPSONGS[numbers[2].no1][numbers[2].no2].tracks,userdata.USER.TOPSONGS[numbers[2].no1][numbers[2].no2].artist];  
            obj['answer'] = 2;
            quiz.push(obj);  x++; break;}

            case 3: {  
                var numbers = [];
                do{
                    var obj1 = {};
                    var no1 = getRandomInt(0,2);
                    var no2 = getRandomInt(5,19);
                    obj1['no1'] = no1;
                    obj1['no2'] = no2;
                    const found2 = numbers.some(item => (item.no1 === no1 && item.no2 === no2) || (no1==num1 && no2==num2));
                    if(found2){
                    }
                    else{
                        numbers.push(obj1);
                    }
                }while(numbers.length < 3);   

            obj['question'] = userdata.USER.TOPSONGS[num1][num2].snippet;
            obj['choice1'] = [userdata.USER.TOPSONGS[numbers[0].no1][numbers[0].no2].tracks,userdata.USER.TOPSONGS[numbers[0].no1][numbers[0].no2].artist];  
            obj['choice2'] = [userdata.USER.TOPSONGS[numbers[1].no1][numbers[1].no2].tracks,userdata.USER.TOPSONGS[numbers[1].no1][numbers[1].no2].artist];  
            obj['choice3'] = [userdata.USER.TOPSONGS[num1][num2].tracks,userdata.USER.TOPSONGS[num1][num2].artist];
            obj['choice4'] = [userdata.USER.TOPSONGS[numbers[2].no1][numbers[2].no2].tracks,userdata.USER.TOPSONGS[numbers[2].no1][numbers[2].no2].artist];  
            obj['answer'] = 3;
            quiz.push(obj);  x++; break;}

            case 4: {
                var numbers = [];
                do{
                    var obj1 = {};
                    var no1 = getRandomInt(0,2);
                    var no2 = getRandomInt(5,19);
                    obj1['no1'] = no1;
                    obj1['no2'] = no2;
                    const found2 = numbers.some(item => (item.no1 === no1 && item.no2 === no2) || (no1==num1 && no2==num2));
                    if(found2){
                    }
                    else{
                        numbers.push(obj1);
                    }
                }while(numbers.length < 3);

            obj['question'] = userdata.USER.TOPSONGS[num1][num2].snippet;
            obj['choice1'] = [userdata.USER.TOPSONGS[numbers[0].no1][numbers[0].no2].tracks,userdata.USER.TOPSONGS[numbers[0].no1][numbers[0].no2].artist];  
            obj['choice2'] = [userdata.USER.TOPSONGS[numbers[1].no1][numbers[1].no2].tracks,userdata.USER.TOPSONGS[numbers[1].no1][numbers[1].no2].artist];  
            obj['choice3'] = [userdata.USER.TOPSONGS[numbers[2].no1][numbers[2].no2].tracks,userdata.USER.TOPSONGS[numbers[2].no1][numbers[2].no2].artist];  
            obj['choice4'] = [userdata.USER.TOPSONGS[num1][num2].tracks,userdata.USER.TOPSONGS[num1][num2].artist];
            obj['answer'] = 4;
            quiz.push(obj);  x++; break;}
        }
    }
    }while(x<10);

        console.log(quiz);


    }

    function checkAnswer(ans,progress){

        if(quiz[progress].answer == ans){
            console.log("true ans")
            return 1;
        }
        else{
            console.log("wrong ans")
        }
        return 0;

    }



    /************ START OF BACKEND */


    console.log("ready!");


    getAPI();

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
                generateQuiz();
                renderQuiz(userprogress);
                time0 = performance.now();


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

                     $('#imgg').append(`<img src=${userdata.USER.image} alt="user_pic">`);
                     $('#username').text(userdata.USER.displayname);
                    // for (let index = 0; index < userdata.USER.ALBUMART.length; index++) { //[0] is the the most played songs , and so on..
                    //     $('.albumcover').append(`<img src=${userdata.USER.ALBUMART[index]} alt=${index} width="200" height="200"> `); //enter width and height here
                    // }


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

    $('input[type="radio"]').click(function () {

        var userans = $('input[name="radio"]:checked').val();
        usercorrect += checkAnswer(userans,userprogress);


        if (userprogress < 9) {
            userprogress++;
            renderQuiz(userprogress);
        } else {
            time1 = performance.now();

            document.cookie = `score=${usercorrect}; samesite=lax; path=/`;
            document.cookie = `name=${userdata.USER.displayname}; samesite=lax; path=/`;
            document.cookie = `time=${(time1-time0)/1000}; samesite=lax; path=/`;
            window.location.href = '/result';

        }
        console.log("userans: "+userans);
        console.log(userprogress);
        console.log("usercorrect: "+usercorrect);
        return;



    });











    // add animation while waiting the page to get data from server 
    // 





    /********* END OF FRONTEND */
}); //end window load