function _getAudioPath() {
  var res = '/android_asset/www/stories/' + (current_story + 1) + '/audio/' + (current_page + 1) + '.wav';
  return res;
}