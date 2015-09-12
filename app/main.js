var React = require('react');
var App = require('./components/App.js');
var MessageForm = require('./components/MessageForm/MessageForm.js');
var Dashboard = require('./components/Dashboard/Dashboard.js');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var createBrowserHistory = require('history/lib/createBrowserHistory');

// Define your routes below
var routes = {
  path: '/',
  component: App,
  defaultRoute: { component: 'Dashboard'},
  childRoutes: [
    { path: 'dashboard', component: Dashboard },
    { path: 'messages', component: MessageForm }
  ]
};

React.render((
  <Router history={createBrowserHistory()} routes={routes} />
), document.body);
