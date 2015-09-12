var flux = require('flux-react');
var actions = require('../actions/UserActions.js');
var HttpService = require('../services/HttpService.js');

module.exports = flux.createStore({
  profile: {},
  actions: [
    actions.login,
    actions.logout
  ],
  login: function(username, password) {
    var store = this;
    var options = {
      url: 'http://localhost:8080/login',
      method: 'POST',
      body: JSON.stringify({username: username, password: password})
    };

    HttpService.send(options, function(err, profile) {
      if (err) {
        // TODO: Centralized error service?
        console.log(err);
        store.profile = null;
      } else {
        store.profile = profile;
        localStorage.jwt = profile.access_token;
      }

      store.emitChange();
    });
  },
  logout: function() {
    var options = {
      url: 'http://localhost:8080/logout',
      method: 'POST'
    };

    HttpService.send(options, function(err, response) {
      if (err) {
        // TODO: Centralized error service?
        console.log(err);
      }

      this.profile = null;
      this.emitChange();
    });
  },
  exports: {
    getProfile: function () {
      return this.profile;
    }
  }
});
