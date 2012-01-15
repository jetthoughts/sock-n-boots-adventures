var current_page = 0;
var current_story = -1;
var autoplay_enabled = true;
var audio_enabled = true;
var music_enabled = false;
var audio_ended = false;
var current_audio = null;

console.log(current_audio);

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
    if (current_audio){
      current_audio.stop();
    }
	current_audio = new Media(src, successCallback);
    current_audio.play(successCallback);
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

function play_clip(object){
    //Check if this object placed on the current page
    if(!event.target.id.match( new RegExp('area'+current_page + '_') )) return;
    
    current_audio.getCurrentPosition(function(position) {                                     
                                        if ( position == -1) {
                                            playAudio('audio/'+current_page + '-' + object+'.wav');
                                        }
                                     });
}



function animalMove() {
    var obj = document.getElementById("figcaption");
    addClass(obj, "lizmove");
    setTimeout(function(){removeClass(obj, "lizmove");}, 1000);
}


//------------------------------------------

function init(){
    var w = $(window).width();
    var h = $(window).height();

    selectStory(1);
    initFlip(w, h);
    
    /*$("ul").carousel({  
                     afterStop:function(currentPage, list){
                     
                     prev_current_page = current_page;
                      current_page = currentPage - 1;
                      
                      if(current_page == prev_current_page) return;
                      
                      current_audio.stop_audio();
                      
                      if(autoplay){
                      if(t!=null) clearTimeout(t);
                      t = setTimeout(function(){
                      t=null;
                      if(!audio_ended) current_audio.stop_audio();
                      playAudio('audio/'+(current_page)+'-1.wav');
                      }, 1200);
                      } else
                      window.audio_ended = true;
                     console.log("after stop");
                     }});*/
    
    $("ul").click(function(){
                  console.log("1122");                 
                  });
    $("li").click(function(){
                  console.log("1122");                 
                  });
    
    $("#auto_play_link").click(function(){
                               
                               });
    
    $("#story_board_link").click(function(){
                                 prevSub();
                                 });
    $("#main_menu_link").click(function(){
                               nextSub();
                               });
    
    
    /*var t = null;
     $("#carousel").carousel({  
     afterStop:function(currentPage, list){
     
     prev_current_page = current_page;
     current_page = currentPage - 1;
     
     if(current_page == prev_current_page) return;
     
     current_audio.stop_audio();
     
     if(autoplay){
     if(t!=null) clearTimeout(t);
     t = setTimeout(function(){
     t=null;
     if(!audio_ended) current_audio.stop_audio();
     playAudio('audio/'+(current_page)+'-1.wav');
     }, 1200);
     } else
     window.audio_ended = true;
     
     }});
     
     $(".active-item img").live("click", function(){
     
     current_audio.getCurrentPosition(function(position) {                                     
     if ( position == -1) {
     console.log("play audio");
     playAudio('audio/'+(current_page)+'-1.wav');
     console.log("play audio");
     
     }
     });
     
     });
     setTimeout(function(){
     window.audio_ended = false;
     current_audio.play();
     }, 1000);
     delete init;*/
}

function selectStory(index){
    if (index != current_story){
        current_story = index;
        setupSubs(index);
        $("ul:last").hide();
        setPage(0);
    }
}

function removeSubs(){
    $("ul").remove();
}

function setPage(p){

        $("ul").hide();
        current_page = p;
        console.log("set page" + p);
        
        if (audio_enabled){
            console.log("play audio");
            playAudio(_getAudioPath());
        }
        
        _currentSub().show();
}

function setupSubs(index){
    removeSubs();
    var texts = TEXTS[index];
    for (var i=0; i<texts.length; i++){
        var ul = $("<ul />");
        var pageTexts = texts[i];
        for (var j=0; j<pageTexts.length; j++){
            $(ul).append("<li>" + pageTexts[j] + "</li>");
        }
        $(_pageId(i)).append(ul);
    }
    $("ul").carousel();
}


function showOptions(){
    $("#options").dialog();
}

function toggleMenu(){
    $("#menu").toggle();
    $("#nav").toggle();

}

function nextSub(){
    $(_currentSub()).animate({left: "+=1024px"}, 300);
}

function prevSub(){
    $(_currentSub()).animate({left: "-=1024px"}, 300);
}

function prevPage(){
    ToPrevPage();
}

function nextPage(){
    ToNextPage();
}


function pageDidChanged(p){
  if (p != current_page){
    setPage(p);
  }
}

function audioDidFinished(){
    console.log("audio finished");
    if (autoplay_enabled){
        nextPage();
    }
}


function _getAudioPath(){
    var res = 'stories/'+(current_story)+'/audio/'+(current_page+1)+'.wav';
    console.log(res);
    return res;
}

function _currentSub(){
    return $(_pageId(current_page)).find("ul");
}

function _pageId(index){
    return "#page_"+index;
}