var React = require('react');
var MessageFormTemplate = require('./MessageForm.rt.js');
var Message = require('./Message.js');
var MessageStore = require('../../stores/MessageStore.js');
var messageActions = require('../../actions/MessageActions.js');


var MessageForm = React.createClass({
  getInitialState: function () {
    return {
      messages: MessageStore.getMessages(),
      newMessage: ''
    };
  },
  componentWillMount: function () {
    MessageStore.addChangeListener(this.changeState);
  },
  componentWillUnmount: function () {
    MessageStore.removeChangeListener(this.changeState);
  },
  changeState: function () {
    this.setState({
      messages: MessageStore.getMessages()
    });
  },
  addMessage: function (event) {
    event.preventDefault();
    var input = this.refs.newMessage.getDOMNode();
    messageActions.addMessage(input.value);
    this.setState({
      newMessage: ''
    });
  },
  updateNewMessage: function (event) {
    this.setState({
      newMessage: event.target.value
    });
  },
  renderMessages: function (text) {
    return (
      <Message text={text} class="fancyClass" />
    );
  },
  render: MessageFormTemplate

});

module.exports = MessageForm;
