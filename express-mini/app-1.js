/**
 *
 *    comparing express and http native module
 *
 */

var http = require('http');
var express = require('./express-1');

var app = express();

app.use('/', function(req, res) {
  res.send('hello mini express');
});

app.use('/haha', function(req, res) {
  res.send('haha mini express');
});

http.createServer(app)
  .listen(3000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:3000/');