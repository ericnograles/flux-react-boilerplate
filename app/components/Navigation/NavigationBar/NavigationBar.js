var React = require('react');
var NavigationBar = require('./NavigationBar.rt.js');

var NavigationBar = React.createClass({
  componentDidMount: function() {
    // MDL
    componentHandler.upgradeDom();
  },
  componentDidUpdate: function() {
    // MDL
    componentHandler.upgradeDom();
  },
  render: NavigationBar
});

module.exports = NavigationBar;
