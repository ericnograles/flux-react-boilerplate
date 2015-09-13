var React = require('react');
var App = require('./components/App.js');
var MessageForm = require('./components/MessageForm/MessageForm.js');
var Dashboard = require('./components/Dashboard/Dashboard.js');
var Login = require('./components/Login/Login.js');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var history = require('./history.js');

// Define your routes below
var routes = {
  path: '/',
  component: App,
  defaultRoute: { component: 'Dashboard'},
  childRoutes: [
    { path: 'dashboard', component: Dashboard },
    { path: 'messages', component: MessageForm },
    { path: 'login', component: Login }
  ]
};

React.render((
  <Router history={history} routes={routes} />
), document.body);
