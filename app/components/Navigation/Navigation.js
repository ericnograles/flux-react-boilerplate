var React = require('react');
var Navigation = require('./Navigation.rt.js');

var Navigation = React.createClass({
  componentDidUpdate: function() {
    componentHandler.upgradeDom();
  },
  render: Navigation
});

module.exports = Navigation;
