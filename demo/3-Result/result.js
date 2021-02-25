$(document).ready(function(){
    boxScatter();

    function boxScatter(){
        for(let x=1;x<=12;x++){
            var topRand = Math.floor(Math.random() * 100);
            var leftRand = Math.floor(Math.random() * 100);
            console.log(topRand);
            console.log(leftRand);
            $("#sqimage"+x).css("top",topRand+"%").css("left",leftRand+"%");
        }
    }

});