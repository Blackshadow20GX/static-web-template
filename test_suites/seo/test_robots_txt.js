var assert = require('assert');
var fs = require('fs');

module.exports = {
  test_robots_txt: function(ROBOTS_PATH, success, failure){
    assert.equal(fs.existsSync(ROBOTS_PATH), true , [failure('robots.txt could not be found at ' + ROBOTS_PATH)]);
    console.log(success('test_robots_txt'));
  }
};