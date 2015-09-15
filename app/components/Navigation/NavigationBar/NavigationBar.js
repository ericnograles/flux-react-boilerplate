var React = require('react');
var NavigationBar = require('./NavigationBar.rt.js');

var NavigationBar = React.createClass({
  componentDidUpdate: function() {
    componentHandler.upgradeDom();
  },
  render: NavigationBar
});

module.exports = NavigationBar;
