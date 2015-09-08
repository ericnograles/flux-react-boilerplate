var React = require('react');
var MessageForm = require('./MessageForm/MessageForm.js');

var App = React.createClass({
	render: function() {
		return (
			<MessageForm />
		);
	}
});
	
module.exports = App;
