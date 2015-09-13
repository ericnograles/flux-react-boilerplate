var React = require('react');
var App = require('./components/App.js');
var Landing = require('./components/Landing/Landing.js');
var Dashboard = require('./components/Dashboard/Dashboard.js');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var history = require('./history.js');

// Define your routes below
var routes =
  [
    {
      path: '/',
      component: App
    },
    {
      path: '/landing',
      component: Landing,
      childRoutes: [
        { path: 'dashboard', component: Dashboard}
      ]
    }
  ];

React.render((
  <Router history={history} routes={routes} />
), document.body);
