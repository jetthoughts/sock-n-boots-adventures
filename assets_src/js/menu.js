var screenSize;
var options = { audio_enabled: false, music_enabled:false};
var cover_audio = null;
var audioCoverTimeout = null;

function stopAudioCover() {
    clearTimeout(audioCoverTimeout);
    if (cover_audio != null) {
        cover_audio.stop();
        cover_audio.release();
    }
}

function playCover(src) {
    if (cover_audio != null) {
        stopAudioCover();
    }

    audioCoverTimeout = setTimeout(function() {
        cover_audio = new Media(_getRoot() + src, function() {
        }, function() {
            cover_audio = null;
        });
        cover_audio.play();
    }, 1000);

}

function playHomeAudio() {
    playCover("home_page_music.wav");
}


function playStoryCover(index) {
    playCover("stories/" + index + "/cover.wav");
}

function hideMainMenu() {
    stopAudioCover();
    $("#main_menu_area").hide();
    $("body").removeClass("main_menu");
}

function showMainMenu() {
    $("body").addClass("main_menu");
    $("#main_menu_area").show();
    playHomeAudio();
}

function hideStorybook() {
    $("#menu_area").hide();
    $("body").removeClass("story_book");
}

function showStorybook() {
    $("body").addClass("story_book");
    $("#menu_area").show();
}

function hideStoryMenu() {
    stopAudioCover();
    $("#story_area").hide();
    $("body").removeClass("story_menu");
}

function showStoryMenu() {
    $("body").addClass("story_menu");
    $("#story_area").show();
    playStoryCover(current_story + 1);

}

function hideHelp() {
    $("#help_area").hide();
    $("body").removeClass("help");
}

function showHelp() {
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

            $("a[rel=product]").each(function(index, element) {
                $(this).text(TITLES[index]);
            });

            $("#page_header").text(HEADER_TITLE);


            $("div.hproducts").coverflow({onSelectedFunc: function(page) {
                hideStorybook();
                selectStory(page);
                showStoryMenu();
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

    $("body.help").live("click", function() {
        hideHelp();
        showMainMenu();
    });

    //------ Story menu
    $("#with_audio_link").bind("click", function() {
        hideStoryMenu();

        audio_enabled = true;
        autoplay_enabled = false;

        showPages();
        return false;
    });

    $("#without_audio_link").bind("click", function() {
        hideStoryMenu();

        audio_enabled = false;
        autoplay_enabled = false;
        showPages();
        return false;
    });

    $("#auto_play_link").bind("click", function() {
        hideStoryMenu();

        autoplay_enabled = true;
        showPages();
        return false;
    });

    //----- Story menu end

});