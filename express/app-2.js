/**
 *
 *    routing
 *
 */

var http = require('http');
var express = require('express');

var app = express();

app.get('/', function(req, res) {
  res.send('hello express');
});

app.post('/', function(req, res) {
  var chunk = [];
  req.on('data', function(data) {
    chunk.push(data);
  }).on('end', function() {
    res.send('get data: ' + Buffer.concat(chunk));
  })
});

http.createServer(app)
  .listen(3000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:3000/');
