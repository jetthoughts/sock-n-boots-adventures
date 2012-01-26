var screenSize;
var options = { audio_enabled: false, music_enabled:false};
var home_audio = null;
var homeAudioTimeout = null; 
function stopHomeAudio(){
  if (home_audio!=null) home_audio.stop();
}  
function playHomeAudio(){
  if (home_audio!=null) home_audio.play();
} 

function hideMainMenu(){
  clearTimeout(homeAudioTimeout);
  stopHomeAudio();
  $("#main_menu_area").hide();
  $("body").removeClass("main_menu");
}  

function showMainMenu(){
  $("body").addClass("main_menu");
  $("#main_menu_area").show();
  homeAudioTimeout = setTimeout("playHomeAudio()", 1000);
}

function hideStorybook(){
    $("#menu_area").hide();
    $("body").removeClass("story_book");
}  

function showStorybook(){
    $("body").addClass("story_book");
    $("#menu_area").show();
}

function  hideStoryMenu(){
    $("#story_area").hide();
    $("body").removeClass("story_menu");
}

function showStoryMenu(){
    $("body").addClass("story_menu");
    $("#story_area").show();
}

function  hideHelp(){
    $("#help_area").hide();
    $("body").removeClass("help");
}

function showHelp(){
    $("body").addClass("help");
    $("#help_area").show();
}


$(document).ready(function() {
  var w = $(window).width();
  var h = $(window).height();
  screenSize = {width:w, height:h};


  //------------- Main menu
  
                  
                  
  $("#storybook_link").bind("click", function() {
    hideMainMenu();
                            showStorybook();
    if (!$(".inventory-featured-default").hasClass("coverflow")) {
      $("div.hproducts").coverflow({onSelectedFunc: function(page){
                                   hideStorybook();
                                   showStoryMenu();
                                   selectStory(Math.max(page,1));
                                   
                                   return false;
      }});
    }
    return false;
  });


  $("#help_link").bind("click", function() {
    hideMainMenu();
    showHelp();

    return false;
  });
  //------------- Main menu end


  //----- Story list

  $(".hproduct").each(function() {

    $(this).find("img:first").attr('src', "stories/" + (parseInt($(this).attr('rel')) + 1) + "/images/" + _device() + "/cover_thumb.jpg");
  });


  $("#s_main_menu_link").bind("click", function() {
                              hideStorybook();
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
                                hideStoryMenu();
                                showStorybook();
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