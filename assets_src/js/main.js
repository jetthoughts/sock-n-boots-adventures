var MENU_ANIMATION_DURATION = 1000;
var LIST_PAGE_DELAY = 500;
var NARRATION_START_DELAY = 1000;


var current_page = 0;
var current_story = -1;

//---------- options
var autoplay_enabled = true;
var audio_enabled = true;

var narTimeout = null;

var subIndex;

var menuAnimating = false;
var pageAnimating = false;

var player = null;

var audioNeedRestore = true;

function stopNarration() {
    if (player != null) player.stopNarration();
    _setPlayLink();
}

function pauseNarration() {
    if (player == null) return false;

    if (player.pauseNarration()) {
        _setPlayLink();
        return true;
    }

}

function resumeNarration() {
    if (player == null) return false;
    if (!isNeedAudio()) return false;

    if (player.resumeNarration()) {
        _setPauseLink();
        return true;
    }

}

function requestNewTime(sec) {
    if (player == null) return false;
    if (player.seekNarration(sec)) {
        _setPauseLink();
    }
}


function playNarration() {
    if (!isNeedAudio()) return false;
    if (player != null) player.playNarration();
    _setPauseLink();
}

//------------------------------------------


function init() {

    var mouseEventTypes = {
        touchstart:"mousedown",
        touchmove:"mousemove",
        touchend:"mouseup"
    };

    for (originalType in mouseEventTypes) {
        document.addEventListener(originalType, function(originalEvent) {
            event = document.createEvent("MouseEvents");
            touch = originalEvent.changedTouches[0];
            event.initMouseEvent(mouseEventTypes[originalEvent.type], true, true,
                    window, 0, touch.screenX, touch.screenY, touch.clientX,
                    touch.clientY, touch.ctrlKey, touch.altKey, touch.shiftKey,
                    touch.metaKey, 0, null);
            originalEvent.target.dispatchEvent(event);
        });
    }

    $("#play_link.play").live("click", function() {
        resumeNarration();
    });

    $("#play_link.pause").live("click", function() {
        pauseNarration();
    });

    $("#story_board_link").click(function() {
        hidePages();
        $("#story_area").show();
        return false;


    });
    $("#menu_trigger").click(function() {

        toggleMenu();
        return false;
    });

    $("#menu_trigger").click(function() {

        toggleMenu();
        return false;
    });
    $("#next").click(function() {

        if (!autoplay_enabled) nextPage(true);
        return false;
    });
    $("#prev").click(function() {
        if (!autoplay_enabled) prevPage();
        return false;
    });

    $("#main_menu_link").click(function() {

        hidePages();

        $("#main_menu_area").show();
        return false;
    });


    $(".subs span .txt").live("click", function(e) {
        if (player != null && player.audioStarting) return;
        if (autoplay_enabled) return;

        var pageSubs = TEXTS[current_story][current_page];

        if (e.offsetX > e.currentTarget.clientWidth / 2) {

            if (subIndex >= 0 && subIndex < pageSubs.length - 1) {
                requestNewTime(pageSubs[subIndex].time);

            }
            nextSub();


        }
        else {

            prevSub();

            var prevIndex = subIndex - 1;
            var time = getStartTime();
            if (prevIndex >= 0 && prevIndex < pageSubs.length) {
                time = pageSubs[prevIndex].time;
            }
            requestNewTime(time);
        }


    });
}

function getStartTime() {
    var prevSubs = TEXTS[current_story][current_page - 1] || [
        {time:0}
    ];
    return prevSubs[prevSubs.length - 1].time + 0.001;
}

function releasePlayer() {
    if (player != null) {
        player.release();
        player = null;
    }
}

function initPlayer() {
    if (audio_enabled) {
        player = new StoryPlayer(true, function() {
            return {start_time: getStartTime()};
        });
        playNarration();
    }
}


function hidePages() {
    hideSubs();
    releasePlayer();
    current_page = 0;
    ttt.toFirstPage();
    $("#pages_area").hide();
}

function showPages() {

    ttt.setDisabled(autoplay_enabled);

    $("#story_area").hide();
    $("#pages_area").show();
    initPlayer();
    setPage(0);
}

function selectStory(index) {
    if (index != current_story) {
        removeStory();
        setMenuOpacity(0, 0);
        current_story = index;
        $("#story_area").css('background-image', "url(" + _coverImage('cover') + ")");

        setupPages(function() {
            $("#book ul").jFlip(screenSize.width, screenSize.height, {background:"green", cornersTop:false}).
                    bind("flip.jflip", function(event, index, total) {
                pageDidChanged(index);
            });

            setupSubs();
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

    if (audioNeedRestore){
      stopNarration();
    }


    hideSubs();
    current_page = p;
    subIndex = 0;
    showSubs();
    
    (getPageCount() - 1 - p) ? $("#next").show() : $("#next").hide();
     p ? $("#prev").show() : $("#prev").hide();

    if (narTimeout != null) {
        clearTimeout(narTimeout);
    }

    if (!isNeedAudio()) {
        stopNarration();
    }
    else if (audioNeedRestore){
       narTimeout = setTimeout("playNarration()", p ? NARRATION_START_DELAY : 0);
    }
    audioNeedRestore = true;

}

function setupPages(pagesLoadedHandler) {
    var pages = $("<ul id='pages'/>");

    var imagesLoadedCount = 0;
    var images = new Array();

    for (var i = 0; i < getPageCount(); i++) {
        images[i] = new Image();
        images[i].src = _pageImage(i + 1);
        images[i].onload = function() {
            imagesLoadedCount++;
            if (imagesLoadedCount == getPageCount()) {


                for (var i = 0; i < getPageCount(); i++) {
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
        var ul = $("<div />").addClass('subs');
        var pageTexts = texts[i];
        for (var j = 0; j < pageTexts.length; j++) {
            var sub = pageTexts[j];
            var subEl = $("<span />");

            $(subEl).append($("<p />").html(sub.text).addClass('txt'));
            $(ul).append(subEl);
        }
        $("#pages_area").append(ul);
    }
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
    //$(".subs span").animate({top:delta}, MENU_ANIMATION_DURATION);
    menuAnimating = true;
    setTimeout("menuAnimating=false", MENU_ANIMATION_DURATION * 2);
}

function getPageCount(){
  return TEXTS[current_story].length;
}

function isNeedAudio() {
    return hasSubs() && audio_enabled;
}

function hasSubs() {
    return TEXTS[current_story][current_page].length > 0;
}

function nextSub() {
    var cur_sub = $(_currentSub()).find("span:visible:first");
    var next_sub = $(cur_sub).next();
    var isAvailable = next_sub.length > 0;

    if (isAvailable) {
        subIndex++;
        $(cur_sub).hide();
        $(next_sub).show();
    }
    return isAvailable;
}

function prevSub() {
    var cur_sub = $(_currentSub()).find("span:visible:first");
    var next_sub = $(cur_sub).prev();
    var isAvailable = next_sub.length > 0;
    if (isAvailable) {
        subIndex--;
        $(cur_sub).hide();
        $(next_sub).show();
    }
    return isAvailable;
}

function prevPage() {

    if (pageAnimating) return;

    stopNarration();
    ttt.prevPage();

    pageAnimating = true;
    setTimeout("pageAnimating=false", LIST_PAGE_DELAY);

}

function nextPage(withInterruptAudio) {
    if (pageAnimating) return;

    if (withInterruptAudio){
      stopNarration();
    }

    audioNeedRestore = withInterruptAudio;

    ttt.nextPage();
    pageAnimating = true;
    setTimeout("pageAnimating=false", LIST_PAGE_DELAY);
}


function pageDidChanged(p) {
    if (p != current_page) {
        setPage(p);
    }
}

function positionDidChanged(position) {
    var pageSubs = TEXTS[current_story][current_page];
    if (subIndex < 0 || subIndex >= pageSubs.length) return;
    if (position >= pageSubs[subIndex].time) {
        if (!nextSub()) {
            nextPage(false);
        }
    }

}

function _setPauseLink() {
    $("#play_link.play").removeClass('play').addClass('pause');
}

function _setPlayLink() {
    $("#play_link.pause").removeClass('pause').addClass('play');
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

function _getAudioRoot() {
    var res = _getRoot() + 'stories/' + (current_story + 1) + '/audio/';
    return res;
}

function _getAudioPath() {
    var res = _getAudioRoot() + (current_page + 1) + '.wav';
    return res;
}

function _device() {
    if (screenSize.width > 480) return "ipad";
    else return "iphone";
}