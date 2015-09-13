var React = require('react');
var NavigationItemTemplate = require('./NavigationItem.rt.js');
var history = require('../../../history.js');

var NavigationItem = React.createClass({
  handleClick: function(event) {
    history.replaceState(null, this.props.route);
  },
  render: NavigationItemTemplate
});
module.exports = NavigationItem;
