var React = require('react/addons');
var App = require('./Login.js');

describe("App", function() {

  it("should be wrapped with a div", function() {
    var app = React.addons.TestUtils.renderIntoDocument(<App />);
    expect(app.getDOMNode().tagName).toEqual('DIV');
  });
});
