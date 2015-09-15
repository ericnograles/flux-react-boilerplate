var React = require('react');
var Navigation = require('./Navigation.rt.js');

var Navigation = React.createClass({
  componentDidMount: function() {
    // MDL
    componentHandler.upgradeDom();
  },
  componentDidUpdate: function() {
    // MDL
    componentHandler.upgradeDom();
  },
  render: Navigation
});

module.exports = Navigation;
