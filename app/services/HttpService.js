var request = require('request');

module.exports = {
  /**
   * A lightweight wrapper for request which automatically injects the jwt from auth
   * @param requestOptions {Object} - The options object for request
   * @param cb {function} - The function to callback for the result
   */
  send: function(requestOptions, cb) {
    // Header override
    requestOptions.headers = requestOptions.headers || {};
    if (localStorage.jwt) {
      requestOptions.headers['authorization'] = 'Bearer ' + localStorage.jwt;
    }
    requestOptions.headers['content-type'] = 'application/json';

    function callback(error, response, body) {
      var dto = body ? JSON.parse(body) : error;
      cb(error, dto);
    }

    // Issue the call
    request(requestOptions, callback);
  }
};