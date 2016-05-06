/**
 *
 *    middleware
 *
 */

var http = require('http');
var express = require('express');

var app = express();

app.use(middleware1);

app.get('/', middleware2, middleware3, function(req, res) {
  res.send('hello express');
});

http.createServer(app)
  .listen(3000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:3000/');

function middleware1(req, res, next) {
  console.log('passing middleware 1');
  next();
}

function middleware2(req, res, next) {
  console.log('passing middleware 2');
  next();
}

function middleware3(req, res, next) {
  console.log('passing middleware 3');
  next();
}