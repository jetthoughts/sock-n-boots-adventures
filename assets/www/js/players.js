var NullPlayer = function() {
  this.audioStarting = false;
  var timer = null;
  var AUTOPLAY_SUB_INTERVAL = 4000;

  this.stopNarrationTimer = function() {
    if (timer == null) return;
    clearInterval(timer);
    timer = null;
  };

  this.startNarrationTimer = function() {
    var self = this;
    timer = setInterval(function() {
      var suc = nextSub();
      if (!suc) {
        nextPage();
      }

    }, AUTOPLAY_SUB_INTERVAL);
  };

  this.playNarration = function(src) {
    this.startNarrationTimer();

  };

  this.stopNarration = function() {
    this.stopNarrationTimer();
  };

  this.pauseNarration = function() {
    this.stopNarrationTimer();
    return true;
  };

  this.resumeNarration = function() {
    this.startNarrationTimer();
    return true;
  };

  this.seekNarration = function(sec) {
  };
  this.release = function(){
  };
};

var PagePlayer = function() {
  this.current_audio = null;
  this.audioStarting = false;
  var timer = null;

  this.stopNarrationTimer = function() {
    if (timer == null) return;

    clearInterval(timer);
    timer = null;
  };

  this.startNarrationTimer = function() {
    var self = this;
    timer = setInterval(function() {
      if (self.current_audio == null) {
        self.stopNarrationTimer();
      }
      else {
        self.current_audio.getCurrentPosition(function(position) {
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
  };

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
  };
  
  this.release = function(){
    this.stopNarration();
  };

  this.pauseNarration = function() {
    if (this.current_audio == null) return false;
    this.stopNarrationTimer();
    this.current_audio.pause();
    return true;
  };

  this.resumeNarration = function() {
    if (this.current_audio == null) return false;
    else {
      this.current_audio.play();
      this.startNarrationTimer();
      return true
    }
  };

  this.seekNarration = function(sec) {
    if (this.audioStarting) return;
    if (this.pauseNarration()) {
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

var StoryPlayer = function(with_music, info) {
  this.withMusic = with_music;
  this.bookInfo = info;
  this.audioStarting = false;
  var timer = null;

  var name = this.withMusic ? "with_music.wav" : "without_music.wav";
  var source = _getAudioRoot() + name;
  this.current_audio = new Media(source, function() {
                                 
                                 }, function() {
                                 console.log("fail");
                                 }
                                 );
  
  this.stopNarrationTimer = function() {
    if (timer == null) return;

    clearInterval(timer);
    timer = null;
  };

  this.startNarrationTimer = function() {
    var self = this;
    timer = setInterval(function() {
      if (self.current_audio == null) {
        self.stopNarrationTimer();
      }
      else {
        self.current_audio.getCurrentPosition(function(position) {
          if (position < 0) {

            self.stopNarrationTimer();
            //audioDidFinished();
          }
          else {
           var info = self.bookInfo();
           if (position>info.limit-2){
               audioDidFinished();
           }
          else{
              positionDidChanged(position - info.offset);
           }
                                              
          }
        });
      }
    }, 1000);
  }

  this.playNarration = function(src) {
    /*
    
    this.stopNarration();

    this.current_audio.play();
    this.startNarrationTimer();
     */
    this.resumeNarration();

  };

  this.stopNarration = function() {
    this.pauseNarration();
  }

  this.releaseNarration = function() {
    this.stopNarrationTimer();

    if (this.current_audio != null) {
      this.current_audio.stop();
      this.current_audio.release();
      this.current_audio = null;
    }

  }


  this.pauseNarration = function() {
    if (this.current_audio == null) return false;
    this.stopNarrationTimer();
    this.current_audio.pause();
    return true;
  }

  this.resumeNarration = function() {
    if (this.current_audio == null) return false;
    else {
      this.current_audio.play();
      this.startNarrationTimer();
      return true;
    }
  }
  
  this.release = function(){
   /* this.player.release();
    this.player = null;*/
  };

  this.seekNarration = function(sec) {
    if (this.audioStarting) return;
    if (this.pauseNarration()) {
      this.audioStarting = true;
      var self = this;
      setTimeout(function() {
        self.current_audio.seekTo(sec * 1000);
        self.resumeNarration();
        self.audioStarting = false;
      }, 500);
    }

  }
};
