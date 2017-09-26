var assert = require('assert');
var fs = require('fs');

module.exports = {
  //Test for existence of sitemap.xml in distribution folder
  test_404_html: function(FOUR_OH_FOUR_PATH, success, failure){
    assert.equal(fs.existsSync(FOUR_OH_FOUR_PATH), true , [failure('404.html could not be found at ' + FOUR_OH_FOUR_PATH)]);
    console.log(success('test_404_html'));
  }
};