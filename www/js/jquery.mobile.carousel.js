(function($) {
    $.fn.carousel = function(options) {
        var settings = {
            duration: 300,
            direction: "horizontal",
            minimumDrag: 20,
            active_class_name: "active-item",
			active_tab_class: "active-tab",
            beforeStart: function(){},
            afterStart: function(){},
            beforeStop: function(){},
            afterStop: function(){}
        };

        $.extend(settings, options || {});

        return this.each(function() {
            if (this.tagName.toLowerCase() != "ul") return;
                         
                         this.test = function(){
                         console.log("gggg");
                         }             
                         
            var originalList = $(this);
            var pages = originalList.children();
            var width = originalList.parent().width();
            var height = originalList.parent().height();

            //Css
            var containerCss = {position: "relative", overflow: "hidden", width: width, height: height};
            var listCss = {position: "relative", padding: "0", margin: "0", listStyle: "none", width: pages.length * width};
            var listItemCss = {width: width, height: height};

            var container = $("<div>").css(containerCss);
            var list = $("<ul>").css(listCss);
            var slidetabs = $("<div id=\"slidetabs\">");

             currentPage = 1, stop;
            if (settings.direction.toLowerCase() === "horizontal") {
                list.css({float: "left"});
                $.each(pages, function(i) {
                    var li = $("<li>")
                            .css($.extend(listItemCss, {float: "left"}))
                            .html($(this).html());
                    list.append(li);
                    
                    slidetabs.append($("<div class=\"tab\">"));
                });

                list.draggable({
                    axis: "x",
                    start: function(event) {
                        settings.beforeStart.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        start = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        settings.afterStart.apply(list, arguments);
                    },
                    stop: function(event) {
                        settings.beforeStop.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        stop = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        start.coords[0] > stop.coords[0] ? moveLeft() : moveRight();

                        function moveLeft() {
                            if (currentPage === pages.length || dragDelta() < settings.minimumDrag) {
                                list.animate({ left: "+=" + dragDelta()}, settings.duration);
                                return;
                            }
                            var new_width = -1 * width * currentPage;
                            list.animate({ left: new_width}, settings.duration);
                            currentPage++;
                        }

                        function moveRight() {
                            if (currentPage === 1 || dragDelta() < settings.minimumDrag) {
                                list.animate({ left: "-=" + dragDelta()}, settings.duration);
                                return;
                            }
                            var new_width = -1 * width * (currentPage - 1);
                            list.animate({ left: -1 * width * (currentPage - 2)}, settings.duration);
                            currentPage--;
                        }

                        function dragDelta() {
                            return Math.abs(start.coords[0] - stop.coords[0]);
                        }

                        function adjustment() {
                            return width - dragDelta();
                        }
                        
			$('li:nth-child('+currentPage+')').addClass(settings.active_class_name).siblings("." + settings.active_class_name).removeClass(settings.active_class_name);
            $(".tab:nth-child("+currentPage+")").addClass(settings.active_tab_class).siblings("."+settings.active_tab_class).removeClass(settings.active_tab_class);
            settings.afterStop.apply(list, [currentPage].concat(Array.prototype.slice.call(arguments)));
            
                    }
                });
            } else if (settings.direction.toLowerCase() === "vertical") {
                $.each(pages, function(i) {
                    var li = $("<li>")
                            .css(listItemCss)
                            .html($(this).html());
                    list.append(li);
                });

                list.draggable({
                    axis: "y",
                    start: function(event) {
                        settings.beforeStart.apply(list, [currentPage].concat(arguments));

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        start = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        settings.afterStart.apply(list, [currentPage].concat(arguments));
                    },
                    stop: function(event) {
                        settings.beforeStop.apply(list, [currentPage].concat(arguments));

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        stop = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        start.coords[1] > stop.coords[1] ? moveUp() : moveDown();

                        function moveUp() {
                            if (currentPage === pages.length || dragDelta() < settings.minimumDrag) {
                                list.animate({ top: "+=" + dragDelta()}, settings.duration);
                                return;
                            }
                            var new_width = -1 * height * currentPage;
                            list.animate({ top: new_width}, settings.duration);
                            currentPage++;
                        }

                        function moveDown() {
                            if (currentPage === 1 || dragDelta() < settings.minimumDrag) {
                                list.animate({ top: "-=" + dragDelta()}, settings.duration);
                                return;
                            }
                            var new_width = -1 * height * (currentPage - 2);
                            list.animate({ top: new_width}, settings.duration);
                            currentPage--;
                        }

                        function dragDelta() {
                            return Math.abs(start.coords[1] - stop.coords[1]);
                        }

                        function adjustment() {
                            return height - dragDelta();
                        }
						$('li:nth-child('+currentPage+')').addClass(settings.active_class_name).siblings("." + settings.active_class_name).removeClass(settings.active_class_name);
            			$(".tab:nth-child("+currentPage+")").addClass(settings.active_tab_class).siblings("."+settings.active_tab_class).removeClass(settings.active_tab_class);
                        settings.afterStop.apply(list, [currentPage].concat(Array.prototype.slice.call(arguments)));
                    }
                });
            }

			list.find("li:first").addClass(settings.active_class_name);
            slidetabs.find(":first").addClass(settings.active_tab_class);
            container.append(list);
            container.append(slidetabs);

            originalList.replaceWith(container);
        });
    };
})(jQuery);
