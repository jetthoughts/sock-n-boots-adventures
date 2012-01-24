var PagePlayer = function(){
  this.current_audio = null;
  this.audioStarting = false;
  var timer = null;

  this.stopNarrationTimer = function(){
    if (timer == null) return;
    
    clearInterval(timer);
    timer = null;
  };
  
  this.startNarrationTimer = function() {
    var self = this;
    timer = setInterval(function() {
                        console.log(self.current_audio);
                        if (self.current_audio == null) {
                        self.stopNarrationTimer();
                        }          
                        else{
                        console.log("2");
                        self.current_audio.getCurrentPosition(function(position) {
                                                                                 console.log(position);
                                                         if (position < 0) {
                                                         
                                                         self.stopNarrationTimer();
                                                         audioDidFinished();
                                                         }
                                                         else {
                                                         positionDidChanged(position);
                                                         }
                                          });
                        }
                        }, 1000);
  }
  
  this.playNarration = function(src) {
    this.stopNarration();
    this.current_audio = new Media(src, function() {

                              }, function() {
                              console.log("fail");
                              }
                              );
    this.current_audio.play();
    this.startNarrationTimer();
   
  };
  
   this.stopNarration = function() {
    this.stopNarrationTimer();
    
    if (this.current_audio != null) {
      this.current_audio.stop();
      this.current_audio.release();
      this.current_audio = null;
    }
  }
  
   this.pauseNarration = function(){
    if (this.current_audio == null) return false;
    this.stopNarrationTimer();
    this.current_audio.pause();
    return true;
  }
   
   this.resumeNarration = function(){
    if (this.current_audio == null) return false;
    else {
      this.current_audio.play();
      this.startNarrationTimer();
      return true
    }
  }
  
  this.seekNarration = function(sec) {
    if (this.audioStarting) return;
    if (this.pauseNarration()){
      this.audioStarting = true;
      var self = this;
      setTimeout(function() {
                 console.log("seek to" + sec);
                 self.current_audio.seekTo(sec * 1000);
                 self.resumeNarration();
                 self.audioStarting = false;
        }, 500);
    }
    
  }
  
  
};