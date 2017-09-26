var assert = require('assert');
var fs = require('fs');

module.exports = {
  //Test for existence of sitemap.xml in distribution folder
  test_sitemap_xml: function(SITEMAP_PATH, success, failure){
    assert.equal(fs.existsSync(SITEMAP_PATH), true , [failure('sitemap.xml could not be found at ' + SITEMAP_PATH)]);
    console.log(success('test_sitemap_xml'));
  }
};