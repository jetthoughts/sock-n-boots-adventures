var screen;

$(document).ready(function() {

                  var w = $(window).width();
                  var h = $(window).height();
                  screen = {width:w, height:h};

  /*$("div.hproducts").coverflow();
  $(".media > a").live("click", function(){
                       $("#menu_area").hide();
                       $("#story_area").show();
                       selectStory(parseInt($(this).attr("rel")));
                    
                       return false;
                  });
                  
                  $(".media > a").each(function(){

                                       $(this).find("img").attr('src', "stories/"+(parseInt($(this).attr('rel'))+1)+"/images/" + _device() +"/cover_thumb.jpg");
                                       });
     
        $("#m_story_board_link").live("click", function(){
            $("#story_area").hide();
            $("#menu_area").show();
             removeStory();
            return false;
        });   */
                  
        $("#with_audio_link").live("click", function(){
                                   console.log("with_audio_link");
                                   $("#story_area").hide();
                                   $("#pages_area").show();
                                   audio_enabled = true;
                                   setPage(0); 
            return false;
        });
        $("#without_audio_link").live("click", function(){
                                             console.log("without_audio_link");
                                    $("#story_area").hide();
                                      $("#pages_area").show();
                                    audio_enabled = false;
                                      setPage(0);  
                                             return false;
        });
                  
                  $("#auto_play_link").live("click", function(){
                                                console.log("without_audio_link");
                                                $("#story_area").hide();
                                                $("#pages_area").show();
                                                audio_enabled = true;
                                                autoplay_link = true;
                                                setPage(0);  
                                                return false;
                });    
                  
});