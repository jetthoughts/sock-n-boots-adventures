var screen;

var audio_ended = false;
var current_audio = null;

var current_page = 0;
var current_story = -1;

//---------- options
var autoplay_enabled = true;
var audio_enabled = false;
var music_enabled = false;


var timer = null;
var subIndex;

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

  if (current_audio) {
    current_audio.stop();
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


  timer = setInterval(function() {

    if (current_audio != null) {
      current_audio.getCurrentPosition(function(position) {

        console.log(position);
        if (position == -1) {

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

/*
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
 }*/

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

  selectStory(1);

  $("#auto_play_link").click(function() {
    console.log("play link click");
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
    removeStory();

    current_story = index;

    setupPages(function() {
      initFlip(screen.width, screen.height);
      setupSubs();
      setPage(0);
    });

  }
}

function removeStory() {
  stopFlip();
  $("#pages").remove();
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
  subIndex = 0;
  showSubs();
  if (audio_enabled) {
    playNarration(_getAudioPath());
  }
}

function setupPages(pagesLoadedHandler) {
  var pages = $("<div id='pages'/>");

  var imagesLoadedCount = 0;
  var images = new Array();
  for (var i = 0; i < TEXTS[current_story].length; i++) {
    images[i] = new Image();
    images[i].src = _pageImage(i);
    images[i].onload = function() {
      imagesLoadedCount++;
      if (imagesLoadedCount == TEXTS[current_story].length) {


        for (var i = 0; i < TEXTS[current_story].length; i++) {
          var page = $("<div id='" + _pageId(i) + "' />").css("background-image", "url(" + _pageImage(i) + ")");
          $(pages).append($("<section />").append(page));
        }
        $("#pageflip-canvas").after(pages);


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
    $("body").append(ul);
  }
}


function showOptions() {
  $("#options").dialog();
}

function toggleMenu() {
  var dir;

  if ($("#menu").css("opacity")!=0) {
    $("#menu").animate({opacity:0}, 1000);  
    $("#nav a").animate({opacity:0}, 1000);
    dir = "+=";
  }
  else {
    $("#menu").animate({opacity:1}, 1000);
    $("#nav a").animate({opacity:1}, 1000);
    dir = "-=";
  }

  var delta = dir + $("#menu").height() + "px";
  $(".subs span").animate({top:delta}, 1000);
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
  stopNarration();
  ToPrevPage();
}

function nextPage() {
  stopNarration();
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

function positionDidChanged(position) {
  var pageSubs = TEXTS[current_story][current_page];
  if (subIndex < 0 || subIndex >= pageSubs.length) return;
  if (position >= pageSubs[subIndex].time) {
    nextSub();
  }
}


function _getAudioPath() {
  var res = 'stories/' + (current_story + 1) + '/audio/' + (current_page + 1) + '.wav';
  console.log(res);
  return res;
}

function _currentSub() {
  return $(".subs:nth(" + current_page + ")");

}

function _pageId(index) {
  return "page_" + current_story + "_" + index;
}

function _pageImage(index) {
  return "stories/" + (current_story + 1) + "/images/" + (index + 1) + ".jpg";
}

function _device() {
  if (screen.width == 1024) return "ipad";
  else return "iphone";
}