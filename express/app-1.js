/**
 *
 *    comparing express and http native module
 *
 */

var http = require('http');
var express = require('express');

var app = express();

app.use('/', function(req, res) {
  res.send('hello express');
});

app.use('/haha', function(req, res) {
  res.send('haha express');
});

http.createServer(app)
  .listen(3000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:3000/');