var React = require('react');
var App = require('./components/App.js');
var Landing = require('./components/Landing/Landing.js');
var Dashboard = require('./components/Dashboard/Dashboard.js');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
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
      component: App
    },
    {
      path: '/',
      component: Landing,
      onEnter: verifyAuth,
      childRoutes: [
        { path: '/dashboard', component: Dashboard, onEnter: verifyAuth }
      ]
    }
  ];

React.render((
  <Router history={history} routes={routes} />
), document.body);
