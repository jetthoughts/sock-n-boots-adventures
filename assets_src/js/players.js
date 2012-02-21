var Player = function(src, finished_handler, position_handler) {
    this.audioFinishedHandler = finished_handler;
    this.positionHandler = position_handler;

    var timer = null;

    this.current_audio = new Media(src, function() {
    }, function() {
        console.log("fail");
    }
            );


    this.stopTimer = function() {
        if (timer == null) return;

        clearInterval(timer);
        timer = null;
    };

    this.startTimer = function() {
        this.stopTimer();
        var self = this;
        timer = setInterval(function() {
            if (self.current_audio == null) {
                self.stopTimer();
            }
            else {
                self.current_audio.getCurrentPosition(function(position) {
                    if (position < 0) {
                        //self.stopTimer();
                        //self.audioFinishedHandler();
                    }
                    else {
                        self.positionHandler(position);
                    }
                });
            }
        }, 100);
    };

    this.play = function(src) {
        this.stop();
        this.current_audio.play();
        this.startTimer();

    };

    this.stop = function() {
        this.stopTimer();

        if (this.current_audio != null) {
            this.current_audio.stop();
        }
    };

    this.release = function() {
        this.stop();
        this.current_audio.release();
        this.current_audio = null;
    };

    this.pause = function() {
        if (this.current_audio == null) return false;
        this.stopTimer();
        this.current_audio.pause();
        return true;
    };

    this.resume = function() {
        if (this.current_audio == null) return false;
        else {
            this.current_audio.play();
            this.startTimer();
            return true;
        }
    };

    this.seek = function(sec) {
        this.current_audio.seekTo(sec * 1000);
    }
};


var StoryPlayer = function(with_music, info) {
    this.withMusic = with_music;
    this.bookInfo = info;
    this.audioStarting = false;

    var name = this.withMusic ? "with_music.wav" : "without_music.wav";
    var source = _getAudioRoot() + name;
    this.player = new Player(source, function() {

    }, function(pos) {
        positionDidChanged(pos);
    }

            );


    this.playNarration = function(src) {

        var info = this.bookInfo();
        this.player.seek(info.start_time);
        this.player.resume();
    };

    this.stopNarration = function() {
        this.player.pause();
    }

    this.release = function() {
        this.player.release();

    }


    this.pauseNarration = function() {
        return this.player.pause();
    }

    this.resumeNarration = function() {
        return this.player.resume();
    }


    this.seekNarration = function(sec) {
        if (!this.player.pause()) return false;
        if (this.audioStarting) return false;

        this.audioStarting = true;
        var self = this;
        setTimeout(function() {
            self.player.seek(sec);
            self.player.resume();
            self.audioStarting = false;
        }, 500);
        return true;
    }
};
