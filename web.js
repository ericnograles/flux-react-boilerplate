var express = require('express');
var path = require('path');
var port = process.env.PORT || 8080;
var app = express();
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var secret = 'super_duper_secret'; //hurrhurrhurr
var cors = require('cors');

// serve static assets normally
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors());

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function(request, response){
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
});

app.post('/login', function(req, res) {
  var token = jwt.sign(req.body, secret);
  return res.status(200).json({username: req.body.username, access_token: token});
});

app.post('/logout', function(req, res) {
  jwt.verify(req.headers['authorization'].replace('Bearer ', ''), secret, function(err, decoded) {
    if (err) {
      return res.status(500).end();
    } else {
      return res.status(200).json({message: 'Logged off ' + decoded.username});
    }
  });
});

app.listen(port);
console.log("server started on port " + port);