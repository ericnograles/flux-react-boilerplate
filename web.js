var express = require('express');
var path = require('path');
var port = process.env.PORT || 8080;
var app = express();

// serve static assets normally
app.use(express.static(__dirname + '/dist'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function(request, response){
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
});

app.listen(port);
console.log("server started on port " + port);