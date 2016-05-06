/**
 *
 *    http native module
 *
 */

var http = require('http');

var app = function (req, res) {
  res.writeHead(200);
  res.end('Hello World\n');
};

http.createServer(app)
  .listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');