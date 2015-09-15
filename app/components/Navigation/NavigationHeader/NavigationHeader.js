var React = require('react');
var NavigationHeader = require('./NavigationHeader.rt.js');
var UserStore = require('../../../stores/UserStore.js');

var NavigationHeader = React.createClass({
  getInitialState: function() {
    var profile = UserStore.getProfile();
    return {
      username: profile ? profile.username : ''
    };
  },
  componentWillMount: function () {
    UserStore.addChangeListener(this.changeState);
  },
  componentWillUnmount: function () {
    UserStore.removeChangeListener(this.changeState);
  },
  componentDidMount: function() {
    // MDL
    componentHandler.upgradeDom();
  },
  componentDidUpdate: function() {
    // MDL
    componentHandler.upgradeDom();
  },
  changeState: function() {
    var profile = UserStore.getProfile();
    this.setState({
      username: profile ? profile.username : ''
    });
  },
  render: NavigationHeader
});

module.exports = NavigationHeader;
