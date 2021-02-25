$(document).ready(function(){

    let menuOpen = false;
    $(".menu-btn").click(function(){
        if(!menuOpen){
            $(".menu-btn").addClass('open');
            $(".navbar-drop").css("min-height","100%");
            menuOpen=true;
        }else{
            $(".menu-btn").removeClass('open');
            $(".navbar-drop").css("min-height","0%");
            menuOpen=false;
        }
    });

});