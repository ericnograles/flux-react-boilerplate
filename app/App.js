var React = require('react');
var MessageForm = require('./components/MessageForm/MessageForm.js');

var App = React.createClass({
	render: function() {
		return (
			<MessageForm />
		);
	}
});
	
module.exports = App;
