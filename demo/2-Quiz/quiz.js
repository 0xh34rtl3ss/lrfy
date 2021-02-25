$(document).ready(function(){
    var totalSeconds = 0;
    setInterval(setTime,1000);
    boxScatter();

    function setTime(){
        ++totalSeconds;
        $("#seconds").html(pad(totalSeconds%60));
        $("#minutes").html(pad(parseInt(totalSeconds/60)) + " ");
    }
    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }
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