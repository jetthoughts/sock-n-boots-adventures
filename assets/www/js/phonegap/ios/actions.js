function _getAudioRoot() {
  var res = 'stories/' + (current_story + 1) + '/audio/';
  return res;
}

function _coverImage(name){
  return _pageImage(name);
}