function _getAudioRoot() {
  var res = '/android_asset/www/stories/' + (current_story + 1) + '/audio/';
  return res;
}

function _coverImage(name){
  return "/android_asset/www/" + _pageImage(name);
}