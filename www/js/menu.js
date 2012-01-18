$(document).ready(function() {
  $("div.hproducts").coverflow();
  $(".media > a").live("click", function(){
                       $("#menu_area").hide();
                       $("#pages_area").show();
                       selectStory(parseInt($(this).attr("rel")));
                       return false;
                  });
});