var MENU_ANIMATION_DURATION = 1000;
var LIST_PAGE_DELAY = 500;
var NARRATION_START_DELAY = 1000;


//var audio_ended = false;

var current_audio = null;
var audio_is_play = false;

var current_page = 0;
var current_story = -1;

//---------- options
var autoplay_enabled = true;
var audio_enabled = true;
var music_enabled = false;


var timer = null;
var narTimeout = null;

var subIndex;

var menuAnimating = false;
var pageAnimating = false;
var audioStarting = false;

/*
Media.prototype.stop_audio = function() {
    this.stop();
    window.audio_ended = true;
}*/

function successCallback() {
    //window.audio_ended = true;

}
/*
function playAudio(src) {
    window.audio_ended = false;
    if (current_audio) {
        current_audio.stop();
    }
    current_audio = new Media(src, successCallback);
    current_audio.play();
}*/

function stopNarration() {
  //window.audio_ended = false;
  stopNarrationTimer();

    if (current_audio != null) {
        current_audio.stop();
        current_audio.release();
        current_audio = null;
    }
  _setPlayLink();
}

function pauseNarration(){
  if (current_audio == null) return false;
  stopNarrationTimer();
  current_audio.pause();
  _setPlayLink();
  return true;
}

function resumeNarration(){
  if (current_audio == null) return; //playNarration();
  else {
    current_audio.play();
    _setPauseLink();
    startNarrationTimer();  
  }
}

function seekNarration(sec) {
  if (audioStarting) return;
  if (pauseNarration()){
    audioStarting = true;
        setTimeout(function() {
            current_audio.seekTo(sec * 1000);
            resumeNarration();
                   audioStarting = false;
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
      _setPauseLink();
}

function stopNarrationTimer(){
  if (timer == null) return;
  
  clearInterval(timer);
  timer = null;
}

function startNarrationTimer() {
    timer = setInterval(function() {

        if (current_audio == null || !audio_is_play) {
                        stopNarrationTimer();
            }          
          else{
            current_audio.getCurrentPosition(function(position) {
                                             
                if (position < 0) {

                    stopNarrationTimer();
                    audioDidFinished();
                }
                else {
                    positionDidChanged(position);
                }
            });
        }
    }, 1000);
}

//------------------------------------------



function init() {
  
  var mouseEventTypes = {
    touchstart : "mousedown",
    touchmove : "mousemove",
    touchend : "mouseup"
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
                                                             
        console.log("play link click");
    });
  
    $("#play_link.pause").live("click", function() {
                        pauseNarration();
        console.log("pause link click");
    });

    $("#story_board_link").click(function() {
                                 hideSubs();
                                 stopNarration();
                                 current_page = 0;
                                 ttt.toFirstPage();                      
                                 $("#pages_area").hide();
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
                           
                           if (!autoplay_enabled) nextPage();
                           return false;
                           });
  $("#prev").click(function() {
                   if (!autoplay_enabled) prevPage();
                   return false;
                   });

    $("#main_menu_link").click(function() {
                               hideSubs();
                               stopNarration(); 
                               current_page = 0;
                               ttt.toFirstPage();
                               $("#pages_area").hide();
                               $("#main_menu_area").show();
        return false;
    });


    $(".subs span .txt").live("click", function(e) {
        if (audioStarting) return;
        if (autoplay_enabled) return;

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

function showStory(){
  
  ttt.setDisabled(autoplay_enabled);
  
  $("#story_area").hide();
  $("#pages_area").show();
  setPage(0);
}

function selectStory(index) {
    if (index != current_story) {
        removeStory();
        setMenuOpacity(0,0);
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
    stopNarration();
    hideSubs();
    current_page = p;
    subIndex = 0;
    showSubs();
    if (audio_enabled && hasSubs()) {
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
    $(".subs span").animate({top:delta}, MENU_ANIMATION_DURATION);
    menuAnimating = true;
    setTimeout("menuAnimating=false", MENU_ANIMATION_DURATION * 2);
}

function hasSubs(){
  return (_currentSub()).find("span").length > 0;
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

function _setPauseLink(){
  audio_is_play = true;
  $("#play_link.play").removeClass('play').addClass('pause');
}

function _setPlayLink(){
  audio_is_play = false;
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

function _device() {
    if (screenSize.width > 480) return "ipad";
    else return "iphone";
}