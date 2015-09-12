var React = require('react');
var App = require('./components/App.js');
var MessageForm = require('./components/MessageForm/MessageForm.js');
var Dashboard = require('./components/Dashboard/Dashboard.js');
var Router = require('react-router').Router;
var Route = require('react-router').Route;

// Define your routes below
React.render((
  <Router>
    <Route path="/" component={App}>
      <Route path="dashboard" component={Dashboard} />
      <Route path="messages" component={MessageForm} />
    </Route>
  </Router>
), document.body);
