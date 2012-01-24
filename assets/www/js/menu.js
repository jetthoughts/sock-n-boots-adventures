var screenSize;
var options = { audio_enabled: false, music_enabled:false};
var home_audio = null;

function stopHomeAudio(){
  if (home_audio!=null) home_audio.stop();
}  
function playHomeAudio(){
  if (home_audio!=null) home_audio.play();
} 
function hideMainMenu(){
  stopHomeAudio();
  $("#main_menu_area").hide();
}  
function showMainMenu(){
  playHomeAudio();
  $("#main_menu_area").show();
}

$(document).ready(function() {
  var w = $(window).width();
  var h = $(window).height();
  screenSize = {width:w, height:h};


  //------------- Main menu
  
                  
                  
  $("#storybook_link").bind("click", function() {
    hideMainMenu();
    $("#menu_area").show();
    if (!$(".inventory-featured-default").hasClass("coverflow")) {
      $("div.hproducts").coverflow();
    }
    return false;
  });


  $("#help_link").bind("click", function() {
                       hideMainMenu();
    $("#help_area").show();

    return false;
  });
  //------------- Main menu end


  //----- Story list


  $(".media > a").bind("click", function() {
    $("#menu_area").hide();
    $("#story_area").show();
    selectStory(parseInt($(this).attr("rel")));

    return false;
  });

  $(".media > a").each(function() {

    $(this).find("img:first").attr('src', "stories/" + (parseInt($(this).attr('rel')) + 1) + "/images/" + _device() + "/cover_thumb.jpg");
  });


  $("#s_main_menu_link").bind("click", function() {
    $("#menu_area").hide();
                              showMainMenu();

    return false;
  });


  $("#s_options_link").bind("click", function() {
    $("#menu_area").hide();
    $("#options_area").show();


    return false;
  });

  $("#s_buy_link").bind("click", function() {
    console.log("s_buy_link clicked");
    return false;
  });

  $("#m_story_board_link").bind("click", function() {
    $("#story_area").hide();
    $("#menu_area").show();
    removeStory();
    return false;
  });

  $("#option_audio").change(function() {
    options.audio_enabled = $(this).is(":checked");
  });
  $("#option_music").change(function() {
    options.music_enabled = $(this).is(":checked");
  });
  $("#options_ok").bind("click", function() {
    $("#options_area").hide();
    $("#menu_area").show();
  });

  //----- Story list end


  //------ Story menu
  $("#with_audio_link").bind("click", function() {

    audio_enabled = true;
    autoplay_enabled = false;

    showPages();
    return false;
  });

  $("#without_audio_link").bind("click", function() {

    audio_enabled = false;
    autoplay_enabled = false;
    showPages();
    return false;
  });

  $("#auto_play_link").bind("click", function() {
    autoplay_enabled = true;
    showPages();
    return false;
  });

  //----- Story menu end

});