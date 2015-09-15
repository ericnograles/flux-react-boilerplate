var React = require('react');
var NavigationItemTemplate = require('./NavigationItem.rt.js');
var history = require('../../../history.js');

var NavigationItem = React.createClass({
  handleClick: function(event) {
    history.replaceState(null, this.props.route);
  },
  componentDidMount: function() {
    // MDL
    componentHandler.upgradeDom();
  },
  componentDidUpdate: function() {
    // MDL
    componentHandler.upgradeDom();
  },
  render: NavigationItemTemplate
});
module.exports = NavigationItem;
