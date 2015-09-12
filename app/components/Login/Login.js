var React = require('react');
var LoginTemplate = require('./Login.rt.js');
var UserStore = require('../../stores/UserStore.js');
var UserActions = require('../../actions/UserActions.js');
var History = require('react-router').History;

var Login = React.createClass({
  mixins: [ History ],
  getInitialState: function () {
    return {
      username: null,
      password: null,
      profile: null
    };
  },
  handleSubmit: function(event) {
    event.preventDefault();
    UserActions.login(this.state.username, this.state.password);
  },
  componentWillMount: function () {
    UserStore.addChangeListener(this.changeState);
  },
  componentWillUnmount: function () {
    UserStore.removeChangeListener(this.changeState);
  },
  changeState: function() {
    this.setState({
      profile: UserStore.getProfile()
    });

    if (this.state.profile) {
      this.history.replaceState(null, '/dashboard');
    } else {
      this.state.message = 'Failed to log you in';
    }
  },
  updateUsername: function (event) {
    this.setState({
      username: event.target.value
    });
  },
  updatePassword: function (event) {
    this.setState({
      password: event.target.value
    });
  },
  render: LoginTemplate

});

module.exports = Login;
