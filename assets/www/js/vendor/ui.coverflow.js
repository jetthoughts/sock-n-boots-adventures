;(function($){
  
	$.widget("ui.coverflow", {
		init: function() {
			$(".inventory-featured-default").addClass("coverflow");
			
			var self = this;
            self.isAnimating = false;
            self.Delta = 0;
            self.percentage = 0;
            self.prevPercentage = 0; 
            this.callback = this.options.onSelectedFunc;
			this.items = $(this.options.items, this.element).bind("click", function() {                                                
                 if ($(this).attr("rel") == self.current && !self.isAnimating){
                 if (self.callback!=null){                              
                    self.callback(self.current);
                 }
               }
            else{          

				//self.moveTo(this);
				//$("div.slider").slider("moveTo", self.current, null, true);
              }
			});
			this.itemWidth = this.items.outerWidth(true);
			
			$(document).bind("keydown", function(e) {
					
				if(e.keyCode == 39 && self.items.length > self.current+1) {
						self.moveTo(self.current+1);
						$("div.slider").slider("moveTo", self.current, null, true);
				}
				
				if(e.keyCode == 37 && self.current-1 >= 0) {
						self.moveTo(self.current-1);
						$("div.slider").slider("moveTo", self.current, null, true);
				}
						
			});
			
			document.ontouchend = function(e) {
             self.isAnimating = false;
			}
			
			document.ontouchmove = function(e){
           self.isAnimating = true;
             
           self.updatePosition(e.touches[0].pageX);
                  

             self.render();  
         
              
			}
			
			document.ontouchstart = function(e) {
				self.startX = e.touches[0].pageX;
				self.swipe = false;
                
			}
			
			$("div.slider").slider({
				min: 0,
				max: self.items.length-1,
				noKeyboard: true,
				slide: function(e, ui) {
					self.moveTo(ui.value);
				}
			});
			
			this.current = 0; //Start item
			
			this.refresh(1, 0, this.current);
             
			this.element.css("left",
				0 //Subtract the padding of the items container
			);
            this.render();
			
		},
             
             updatePosition: function(curX){
             console.log(this.startX - curX);
               this.Delta+=( this.startX - curX);
               if (this.Delta<0) {
                 this.Delta =0;
               }
             var scrollSze  = (this.element.parent()[0].offsetWidth/2);
               if (this.Delta>scrollSze){
                 this.Delta=scrollSze;

               } 
             this.prevPercentage = this.percentage;
               this.percentage = this.Delta/scrollSze;
               this.current =  Math.round(Math.min(2,Math.max(0,this.percentage/0.4)));
               $(".info").html($(".fn",this.items[this.current]).text());
               this.startX = curX;
             
             },
             render: function(duration){
             var self = this;
             duration = duration || Math.abs(self.percentage - self.prevPercentage)*100;
    
             self.items.each(function(i) {
                             
                             
                             var side = i < self.current ? "left" : "right";
                             var mod = self.current==i ? 0 : 1;
                             
                             var angles = [[0,80],[-80, 80], [-80, 0]];
                             var midWidth = (self.element.parent()[0].offsetWidth/2 - self.itemWidth/2);
                             var positions = [
                                              [midWidth,30],
                                              [midWidth,50- self.itemWidth], 
                                              [midWidth - self.itemWidth + 30,(self.element.parent()[0].offsetWidth/2 - 3*self.itemWidth) +self.itemWidth/2]
                                              ];
                             
                             
                             var angle =  (((angles[i][1] - angles[i][0])*self.percentage) + angles[i][0] )
                             
                             
                             var leftOffset = ( (((positions[i][1] - positions[i][0])*self.percentage) + positions[i][0] ) ) + "px";
                             
                             var rotateTransform = (angle ) + "deg";
                             var scalCoff =  Math.abs(0.5*i - self.percentage);
                             
                             var scaleTransform = (1 +  Math.max(0.3-scalCoff,0));
                             
                             
                             $(this).animate({
                                         rotate: rotateTransform,
                                         scale: scaleTransform,
                                         left: leftOffset,
                                         "z-index": i== self.current ? 2: -1
                                             },  duration);
                             
                             
                             
                             
                             });
             
             },
		moveTo: function(item) {
			
			this.previous = this.current;
			this.current = !isNaN(parseInt(item)) ? parseInt(item) : this.items.index(item);
             this.prevPercentage = this.percentage;
            this.percentage = 0.5*this.current;
            this.render(300);
			
            
			
		},
		
		refresh: function(state,from,to) {
			
			var self = this, offset = null;
             console.log("refresh");
			this.items.each(function(i) {
								
				var side = (i == to && from-to < 0 ) ||  i-to > 0 ? "left" : "right";
				var mod = i == to ? (1-state) : ( i == from ? state : 1 );
                            console.log("mode="+mod);
				var before = (i > from && i != to);
                            var angle = 80;
                            var webTransform = "scale("+(1+((1-mod)*0.1))+")  rotateY(" + (side === "right" ? angle : -angle ) + "deg)";
				if(i === self.current) {
					webTransform = "scale(1.3)";
					mozTransform = "scale(1.3)";
					$(".info").html($(".fn",this).text());
				} else {
					mozTransform = "scale(1)";
				}
                var l = (
                                     (-i * (self.itemWidth/2))
                                     + (side == "right"? -self.itemWidth/2 : self.itemWidth/2) * mod //For the space in the middle
                                     );
                           
				$(this).css({
					"-webkit-transform": webTransform,
					"-moz-transform": mozTransform,
					left: l,
					zIndex: self.items.length + (side == "left" ? to-i : i-to)
				});
								
				if(!$.browser.msie)
					$(this).css("opacity", 1 - Math.abs((side == "left" ? to-i : i-to)) / 8);

			});
			
		}
	});
	
	$.extend($.ui.coverflow, {
		defaults: {
			items: "> *",
            onSelectedFunc : null
		}
	});
	
})(jQuery); 