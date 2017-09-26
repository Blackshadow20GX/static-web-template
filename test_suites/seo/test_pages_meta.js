var fs = require('fs');
var glob = require('glob');
var assert = require('assert');
var forEach = require('async-foreach').forEach;

module.exports = {
  //Test for existence of meta tags in each page
  test_pages_meta: function(PAGES_PATH, success, failure){
    var files = new glob(PAGES_PATH, {mark:true, sync:true});
  
    forEach(files, function(item, index, arr) {
      fs.readFile(item, function (err, data) {
        if (err) throw err;
        const index = data.indexOf('<meta');
        if(index < 0){
          assert.fail([failure('Meta tags were not detected in ' + item)]);
        };
      });
    });
    
    console.log(success('test_pages_meta'));
  }
};