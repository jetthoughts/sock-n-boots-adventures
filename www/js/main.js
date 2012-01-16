var screen;

var audio_ended = false;
var current_audio = null;

var current_page = 0;
var current_story = -1;

//---------- options
var autoplay_enabled = true;
var audio_enabled = true;
var music_enabled = false;


var timer = null;


Media.prototype.stop_audio = function() {
    this.stop();
    window.audio_ended = true;
}

function successCallback() {
    window.audio_ended = true;

}

function playAudio(src) {
    console.log(src)
    window.audio_ended = false;
    if (current_audio) {
        current_audio.stop();
    }
    current_audio = new Media(src, successCallback);
    current_audio.play();
}


function playNarration(src) {
    window.audio_ended = false;
    if (current_audio) {
        current_audio.stop();
    }
    current_audio = new Media(src, function() {
            successCallback();
        }, function() {
            console.log("fail");
        }
    );
    current_audio.play();

    if (timer != null) clearInterval(timer);
    timer = setInterval(function() {
        if (current_audio != null) {
            current_audio.getCurrentPosition(function(position) {
                if (position == -1) {
                                           
                    clearInterval(timer);
                    audioDidFinished();
                }
                else {

                }
            });
        }
        else {
            clearInterval(timer);
        }
    }, 1000);
}


function with_audio() {
    current_audio.stop_audio();
    playAudio('audio/1-1.wav');
    autoplay = true;
    pageMove();
}


function without_audio() {
    current_audio.stop_audio();
    autoplay = false;
    pageMove();
}

function play_clip(object) {
    //Check if this object placed on the current page
    if (!event.target.id.match(new RegExp('area' + current_page + '_'))) return;

    current_audio.getCurrentPosition(function(position) {
        if (position == -1) {
            playAudio('audio/' + current_page + '-' + object + '.wav');
        }
    });
}


function animalMove() {
    var obj = document.getElementById("figcaption");
    addClass(obj, "lizmove");
    setTimeout(function() {
        removeClass(obj, "lizmove");
    }, 1000);
}


//------------------------------------------

function init() {
    var w = $(window).width();
    var h = $(window).height();
    screen = {width:w, height:h};
    selectStory(0);
    initFlip(w, h);

    $("#auto_play_link").click(function() {

    });

    $("#story_board_link").click(function() {
        prevSub();
    });
    $("#main_menu_link").click(function() {
        nextSub();
    });


    $(".subs span .txt").live("click", function(e) {

        (e.offsetX > e.currentTarget.clientWidth / 2) ? nextSub() : prevSub();


    });
}

function selectStory(index) {
    if (index != current_story) {
        current_story = index;
        setupSubs();
        setPage(0);
    }
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
    hideSubs();
    current_page = p;
    console.log("set page" + p);

    if (audio_enabled) {
        console.log("play audio");
        playNarration(_getAudioPath());
    }
    showSubs();
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

            $(subEl).append($("<div />").text(sub.text).addClass('txt'));
            $(ul).append(subEl);
        }
        $("body").append(ul);
    }
}


function showOptions() {
    $("#options").dialog();
}

function toggleMenu() {
    $("#menu").toggle();
    $("#nav").toggle();

}

function nextSub() {
    var cur_sub = $(_currentSub()).find("span:visible:first");
    var next_sub = $(cur_sub).next();
    if (next_sub.length > 0) {
        $(cur_sub).hide();
        $(next_sub).show();
    }
}

function prevSub() {
    var cur_sub = $(_currentSub()).find("span:visible:first");
    var next_sub = $(cur_sub).prev();
    if (next_sub.length > 0) {
        $(cur_sub).hide();
        $(next_sub).show();
    }
}

function prevPage() {
    ToPrevPage();
}

function nextPage() {
    ToNextPage();
}


function pageDidChanged(p) {
    if (p != current_page) {
        setPage(p);
    }
}

function audioDidFinished() {
    console.log("audio finished");
    if (autoplay_enabled) {
        nextPage();
    }
}


function _getAudioPath() {
    var res = 'stories/' + (current_story + 1) + '/audio/' + (current_page + 1) + '.wav';
    console.log(res);
    return res;
}

function _currentSub() {
    //return $(_pageId(current_page)).find(".subs");
    return $(".subs:nth(" + current_page + ")");

}

function _pageId(index) {
    return "#page_" + index;
}