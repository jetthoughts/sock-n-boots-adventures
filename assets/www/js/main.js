var MENU_ANIMATION_DURATION = 1000;
var LIST_PAGE_DELAY = 1000;
var NARRATION_START_DELAY = 1000;


var audio_ended = false;
var current_audio = null;

var current_page = 0;
var current_story = -1;

//---------- options
var autoplay_enabled = true;
var audio_enabled = false;
var music_enabled = false;


var timer = null;
var narTimeout = null;

var subIndex;

var menuAnimating = false;
var pageAnimating = false;

Media.prototype.stop_audio = function() {
    this.stop();
    window.audio_ended = true;
}

function successCallback() {
    window.audio_ended = true;

}

function playAudio(src) {
    window.audio_ended = false;
    if (current_audio) {
        current_audio.stop();
    }
    current_audio = new Media(src, successCallback);
    current_audio.play();
}

function stopNarration() {
    window.audio_ended = false;
    if (timer != null) {

        clearInterval(timer);
        timer = null;
    }

    if (current_audio != null) {
        current_audio.stop();
        current_audio.release();
        current_audio = null;
    }
}

function seekNarration(sec) {
    if (current_audio != null) {
        if (timer != null) {

            clearInterval(timer);
            timer = null;
        }
        current_audio.pause();
        setTimeout(function() {
            current_audio.seekTo(sec * 1000);
            current_audio.play();
            startNarrationTimer();
        }, 500);
    }

}

function playNarration(src) {
    stopNarration();
    current_audio = new Media(src, function() {

            successCallback();
        }, function() {
            console.log("fail");
        }
    );
    current_audio.play();
    startNarrationTimer();
}


function startNarrationTimer() {
    timer = setInterval(function() {

        if (current_audio != null) {
            current_audio.getCurrentPosition(function(position) {

                console.log(position);
                if (position < 0) {

                    clearInterval(timer);
                    audioDidFinished();
                }
                else {
                    positionDidChanged(position);
                }
            });
        }
        else {
            clearInterval(timer);
        }
    }, 1000);
}

//------------------------------------------

function init() {

    selectStory(1);
    $("#auto_play_link").click(function() {
        console.log("play link click");
    });

    $("#story_board_link").click(function() {
        /*$("#pages_area").hide();
         setMenuOpacity(0,0);
         $("#menu_area").show();
         removeStory();*/
        return false;


    });
    $("#menu_trigger").click(function() {

        toggleMenu();


    });

    $("#main_menu_link").click(function() {
        /* hideSubs();
         stopNarration();
         current_page = -1;
         $("#pages_area").hide();
         $("#story_area").show(); */
        return false;
    });


    $(".subs span .txt").live("click", function(e) {
        var pageSubs = TEXTS[current_story][current_page];
        if (e.offsetX > e.currentTarget.clientWidth / 2) {


            if (subIndex >= 0 && subIndex < pageSubs.length) {
                seekNarration(pageSubs[subIndex].time);
            }

            nextSub();

        }
        else {

            prevSub();

            var prevIndex = subIndex - 1;
            if (prevIndex < 0 || prevIndex >= pageSubs.length) {
                seekNarration(0.001);
            }
            else {
                seekNarration(pageSubs[prevIndex].time);
            }
        }

    });
}

function selectStory(index) {
    if (index != current_story) {
        removeStory();

        current_story = index;
      console.log(_coverImage('cover'));
        $("#story_area").css('background-image', "url(" + _coverImage('cover') + ")");

        setupPages(function() {
            $("#book ul").jFlip(screen.width, screen.height, {background:"green", cornersTop:false}).
                bind("flip.jflip", function(event, index, total) {
                    pageDidChanged(index);
                });

            setupSubs();
            setPage(0);
        });

    }
}

function removeStory() {
    stopNarration();
    current_story = -1;
    $("#story_area").css('background-image', "");
    $("#book").html('');
}

function removeSubs() {
    $(".subs").remove();
}

function hideSubs() {
    $(_currentSub()).find("span").hide();
}

function showSubs() {
    $(_currentSub()).find("span:first").show();
}

function setPage(p) {
    stopNarration();
    hideSubs();
    current_page = p;
    subIndex = 0;
    showSubs();
    console.log("play audio " + audio_enabled);
    if (audio_enabled) {
        if (narTimeout != null) {
            clearTimeout(narTimeout);
        }
        narTimeout = setTimeout(function() {

            playNarration(_getAudioPath());


        }, NARRATION_START_DELAY);
    }
}

function setupPages(pagesLoadedHandler) {
    var pages = $("<ul id='pages'/>");

    var imagesLoadedCount = 0;
    var images = new Array();

    for (var i = 0; i < TEXTS[current_story].length; i++) {
        images[i] = new Image();
        images[i].src = _pageImage(i + 1);
        images[i].onload = function() {
            imagesLoadedCount++;
            if (imagesLoadedCount == TEXTS[current_story].length) {


                for (var i = 0; i < TEXTS[current_story].length; i++) {
                    var page = $("<img />").attr("src", _pageImage(i + 1));
                    $(pages).append($("<li id='" + _pageId(i) + "' />").append(page));
                }

                $("#book").append(pages);


                pagesLoadedHandler();

            }

        };
    }

}

function setupSubs() {
    removeSubs();
    var texts = TEXTS[current_story];
    for (var i = 0; i < texts.length; i++) {
        var ul = $("<span />").addClass('subs');
        var pageTexts = texts[i];
        for (var j = 0; j < pageTexts.length; j++) {
            var sub = pageTexts[j];
            var subEl = $("<span />");
            var x = sub.x * screen.width / 100;
            var y = sub.y * screen.height / 100;
            $(subEl).css("left", x + "px").css("top", y + "px");


            $(subEl).append($("<div />").html(sub.text).addClass('txt'));
            $(ul).append(subEl);
        }
        $("#pages_area").append(ul);
    }
}


function showOptions() {
    $("#options").dialog();
}

function setMenuOpacity(val, dur) {
    $("#menu").animate({opacity:val}, dur);
    $("#nav a").animate({opacity:val}, dur);
}

function toggleMenu() {
    if (menuAnimating) return;

    var dir;

    if ($("#menu").css("opacity") == 1) {
        setMenuOpacity(0, MENU_ANIMATION_DURATION);
        dir = "+=";
    }
    else if ($("#menu").css("opacity") == 0) {
        setMenuOpacity(1, MENU_ANIMATION_DURATION);
        dir = "-=";
    }

    var delta = dir + $("#menu").height() + "px";
    $(".subs span").animate({top:delta}, MENU_ANIMATION_DURATION);
    menuAnimating = true;
    setTimeout("menuAnimating=false", MENU_ANIMATION_DURATION * 2);
}

function nextSub() {
    var cur_sub = $(_currentSub()).find("span:visible:first");
    var next_sub = $(cur_sub).next();
    if (next_sub.length > 0) {
        subIndex++;
        $(cur_sub).hide();
        $(next_sub).show();
    }
}

function prevSub() {
    var cur_sub = $(_currentSub()).find("span:visible:first");
    var next_sub = $(cur_sub).prev();
    if (next_sub.length > 0) {
        subIndex--;
        $(cur_sub).hide();
        $(next_sub).show();
    }
}

function prevPage() {
    if (pageAnimating) return;

    stopNarration();
    ttt.prevPage();

    pageAnimating = true;
    setTimeout("pageAnimating=false", LIST_PAGE_DELAY);

}

function nextPage() {
    if (pageAnimating) return;

    stopNarration();
    ttt.nextPage();

    pageAnimating = true;
    setTimeout("pageAnimating=false", LIST_PAGE_DELAY);


}


function pageDidChanged(p) {
    if (p != current_page) {
        setPage(p);
    }
}

function audioDidFinished() {

    if (autoplay_enabled) {
        nextPage();
    }
}

function positionDidChanged(position) {
    var pageSubs = TEXTS[current_story][current_page];
    if (subIndex < 0 || subIndex >= pageSubs.length) return;
    if (position >= pageSubs[subIndex].time) {
        nextSub();
    }
}

function _currentSub() {
    return $(".subs:nth(" + current_page + ")");

}

function _pageId(index) {
    return "page_" + current_story + "_" + index;
}

function _pageImage(index) {
    return "stories/" + (current_story + 1) + "/images/" + _device() + "/" + index + ".jpg";
}

function _device() {
    if (screen.width > 480) return "ipad";
    else return "iphone";
}