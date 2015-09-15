var React = require('react');
var UserStore = require('../../stores/UserStore.js');
var UserActions = require('../../actions/UserActions.js');
var AppTemplate = require('./Login.rt.js');
var history = require('../../history.js');

var App = React.createClass({
	getInitialState: function() {
		document.title = 'flux-react-boilerplate: the remix';
		return {
			username: null,
			password: null,
			loggingIn: false
		};
	},
	componentWillMount: function () {
		UserStore.addChangeListener(this.changeState);
	},
	componentWillUnmount: function () {
		UserStore.removeChangeListener(this.changeState);
	},
	handleSubmit: function(event) {
		event.preventDefault();
		var component = this;
		this.setState({
			loggingIn: true
		});
		setTimeout(function() {
			UserActions.login(component.state.username, component.state.password);
		}, 1000);
	},
	changeState: function() {
		var profile = UserStore.getProfile();
		if (profile) {
			history.replaceState(null, '/');
		} else {
			this.state.errorMessage = 'Login unsuccessful. Please try again.';
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
	render: AppTemplate
});
	
module.exports = App;
