var fs = require('fs');
var glob = require('glob');
var assert = require('assert');
var forEach = require('async-foreach').forEach;
var external_href = require('../helpers/external_href').external_href;

module.exports = {
  //Test for existence of img sources in each page
  test_pages_img: function(PAGES_PATH, ASSETS_PATH, success, failure){
    var files = new glob(PAGES_PATH, {mark:true, sync:true});
  
    forEach(files, function(item, index, arr) {
      fs.readFile(item, function (err, data) {
        if (err) throw err;
        
        const text = data.toString();
        var regex = /<img src="(.*?)"/g;
        var raw_urls = text.match(regex);
        
        if(raw_urls !== null) //If a match is found, continue
        {
          //Remove all img src='s from matched urls
          var urls = raw_urls.map(function (a){ 
            return a.replace('<img src=', '');
          });

          //For each match, check existence of appropriate file
          forEach(urls, function(item, index, arr){
            //Parse into appropriate string
            var file_string = urls[index].toString().replace(/\"/g, '');
            var internal_path = ASSETS_PATH + file_string;
            var success = fs.existsSync(internal_path);
            if(!success){
              //It failed internal check. Test if external.
              external_href(file_string)
                .then(function(isAvail){
                  assert.equal(isAvail, true, failure('External/internal link for ' + file_string + ' not found.'));
                })
                .catch(function (error){
                  console.error(error);
                });
            };
          });
        }
      });
    });
    
    console.log(success('test_pages_img'));
  }
}