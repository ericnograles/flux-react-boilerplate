var React = require('react');
var Link = require('react-router').Link;
var UserStore = require('../stores/UserStore.js');
var AppTemplate = require('./App.rt.js');
var history = require('../history.js');


var App = React.createClass({
	getInitialState: function() {
		return {
			profile: UserStore.getProfile()
		};
	},
	componentWillMount: function () {
		UserStore.addChangeListener(this.changeState);
	},
	componentWillUnmount: function () {
		UserStore.removeChangeListener(this.changeState);
	},
	navigateTo: function(route) {
		history.replaceState(null, route);
	},
	changeState: function() {
		this.setState({
			profile: UserStore.getProfile()
		});
	},
	render: AppTemplate
});
	
module.exports = App;
