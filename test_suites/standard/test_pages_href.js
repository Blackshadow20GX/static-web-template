var fs = require('fs');
var glob = require('glob');
var assert = require('assert');
var external_href = require('../helpers/external_href').external_href;
var forEach = require('async-foreach').forEach;

module.exports = {
  //Test for existence of hrefs in each page
  test_pages_href: function(PAGES_PATH, success, failure){
    var files = new glob(PAGES_PATH, {mark:true, sync:true});
      
    forEach(files, function(item, index, arr) {
      fs.readFile(item, function (err, data) {
        if (err) throw err;

        const text = data.toString();
        var regex = /href="(?!.*?\.css)(.*?)"/g;
        var raw_urls = text.match(regex);
        if(raw_urls !== null) { //If match found, continue
          //Remove all hrefs from matched urls
          var urls = raw_urls.map(function (a){ 
            return a.replace('href=', '');
          });
        

          //For each match, check existence of appropriate file
          forEach(urls, function(item, index, arr){
          //Parse into appropriate string
          var file_string = urls[index].toString().replace(/\"/g, '');
          var internal_path = "dist" + file_string + "/index.html";
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
  console.log(success('test_pages_href'));
  }
}