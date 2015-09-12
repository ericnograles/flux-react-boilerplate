var React = require('react');
var Link = require('react-router').Link;
var UserStore = require('../stores/UserStore.js');

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
	changeState: function() {
		this.setState({
			profile: UserStore.getProfile()
		});
	},
	render: function() {
		return (
			<div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
				<header className="custom-header mdl-layout__header mdl-layout__header--waterfall">
					<div className="mdl-layout__header-row">
						<span className="mdl-layout-title">React Boilerplate</span>
						<div className="mdl-layout-spacer"></div>
						<nav className="mdl-navigation mdl-layout--large-screen-only">
							<Link className="mdl-navigation__link" to="/dashboard">Dashboard</Link>
							<Link className="mdl-navigation__link" to="/messages">Messages</Link>
						</nav>
					</div>
				</header>
				<div className="mdl-layout__drawer">
					<span className="mdl-layout-title">Sidebar Menu</span>
					<nav className="mdl-navigation">
						<Link className="mdl-navigation__link" to="/dashboard">Dashboard</Link>
						<Link className="mdl-navigation__link" to="/messages">Messages</Link>
					</nav>
				</div>
				<main className="mdl-layout__content">
					<div className="page-content">
						{this.props.children}
					</div>
				</main>
			</div>
		);
	}
});
	
module.exports = App;
