/**
 *
 *    routing
 *
 */

var http = require('http');
var express = require('./express-2');

var app = express();

app.get('/', function(req, res) {
  res.send('get mini express');
});

app.post('/', function(req, res) {
  var chunk = [];
  req.on('data', function(data) {
    chunk.push(data);
  }).on('end', function() {
    res.send('mini express post data: ' + Buffer.concat(chunk));
  })
});

http.createServer(app)
  .listen(3000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:3000/');
