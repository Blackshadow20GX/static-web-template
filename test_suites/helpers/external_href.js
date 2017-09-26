var url = require("url");
var request = require('request');

//Returns whether specified link returns a useful HTTP status or not
module.exports = {
  external_href: function(uri){
    var address = url.parse(uri); 
    var parts = uri.split('/');
    var options = {
      host: address.protocol != null ? address.host : parts[0],
      method: 'HEAD',
      path: address.protocol != null ? address.pathname : parts.slice(1).join('/')
    };

    var promise = new Promise(function (resolve, reject) {
      var connected = false;
      request(uri, function (error, response, body) {

        if(error !== null){
            resolve(connected);
            return promise;
        };
        
        connected = response.statusCode < 400;
        resolve(connected);  
      });
    });
    return promise;
  }
}