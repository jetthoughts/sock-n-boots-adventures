var current_page = 0;
var autoplay = true;
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

function init(){
    var t = null;
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
    delete init;
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

function hasClass(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
	if (!this.hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
	if (hasClass(ele,cls)) {
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
	}
}

function animalMove() {
    var obj = document.getElementById("figcaption");
    addClass(obj, "lizmove");
    setTimeout(function(){removeClass(obj, "lizmove");}, 1000);
}


function pageMove() {
    var obj = $('ul');
    obj.animate({left: -1024}, 300);
    currentPage++; 
    current_page=1;
    $("li:nth-child(2)").addClass("active-item").siblings("active-item").removeClass("active-item");	
}

function go_to_homesite(){
    window.location='http://www.larriottheliger.com/2010/ligers-are-real/';
}

