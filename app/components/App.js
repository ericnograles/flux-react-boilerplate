var React = require('react');
var Link = require('react-router').Link;

var App = React.createClass({
	render: function() {
		return (
			<div>
				<h1>App</h1>
				<ul>
					<li><Link to="/dashboard">Dashboard</Link></li>
					<li><Link to="/messages">Messages</Link></li>
				</ul>
				<h2>The Route Below</h2>
				<div>
					{this.props.children}
				</div>
			</div>
		);
	}
});
	
module.exports = App;
