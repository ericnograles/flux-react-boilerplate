var React = require('react');
var Login = require('./components/Login/Login.js');
var Landing = require('./components/Landing/Landing.js');
var Router = require('react-router').Router;
var UserStore = require('./stores/UserStore.js');
var history = require('./history.js');

var verifyAuth = function(nextState, redirectTo) {
  var profile = UserStore.getProfile();
  if (!profile) {
    redirectTo('/login', '/login', { nextPathname: nextState.location.pathname });
  }
};

// Define your routes below
var routes =
  [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Landing,
      //onEnter: verifyAuth
    }
  ];

document.addEventListener('DOMContentLoaded', function(event) {
  // MDL accommodation
  componentHandler.upgradeDom();
});

React.render((
  <Router history={history} routes={routes} />
), document.body);
