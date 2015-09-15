var React = require('react');
var UserStore = require('../../stores/UserStore.js');
var LandingTemplate = require('./Landing.rt.js');
var history = require('../../history.js');

var Landing = React.createClass({
  getInitialState: function() {
    return {
      profile: UserStore.getProfile()
    };
  },
  componentWillMount: function () {
    componentHandler.upgradeDom();
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
  navigateTo: function(route) {
    history.replaceState(null, route);
  },
  changeState: function() {
    this.setState({
      profile: UserStore.getProfile()
    });
  },
  render: LandingTemplate
});

module.exports = Landing;
