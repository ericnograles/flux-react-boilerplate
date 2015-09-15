var React = require('react');
var DashboardTemplate = require('./Dashboard.rt.js');


var MessageForm = React.createClass({
  getInitialState: function () {
    this.props.title = 'Tester';
    return {};
  },
  componentWillMount: function () {
    console.log('Dashboard Mounted');
    return;
  },
  componentDidMount: function() {
    // MDL
    componentHandler.upgradeDom();
  },
  componentDidUpdate: function() {
    // MDL
    componentHandler.upgradeDom();
  },
  componentWillUnmount: function () {
    console.log('Dashboard Unmounted');
    return;
  },
  render: DashboardTemplate

});

module.exports = MessageForm;
