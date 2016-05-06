var url = require('url');
var http = require('http');

module.exports = function() {

  var routes = [];

  http.ServerResponse.prototype.send = function(code, text) {
    if (typeof code !== 'number') {
      text = code;
      code = 200;
    }

    this.writeHead(code),
    this.end(text);
  }

  var app = function(req, res) {
    var pathname = url.parse(req.url).pathname;

    for (var i = 0; i < routes.length; i++) {
      var route = routes[i];
      if (pathname === route[0]) {
        var action = route[1];
        action(req, res);
        return;
      }
    }

    handle404(req, res);
  }

  app.use = function(path, action) {
    routes.push([path, action]);
  }

  return app;
}

function handle404(req, res) {
  res.send(404, 'not found')
}