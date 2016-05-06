/**
 *
 *    render function
 *
 */

var http = require('http');
var express = require('express');

var app = express();

app.engine('hbs', require('express-hbs').express4());
app.set('view engine', 'hbs');
app.set('views', process.cwd() + '/views');

app.use('/', function(req, res) {
  res.render('index', { data: 'handlebars' });
});

http.createServer(app)
  .listen(3000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:3000/');