var url = require('url');
var http = require('http');

module.exports = function () {

  var routes = {
    'all': []
  };

  http.ServerResponse.prototype.send = function (code, text) {
    if (typeof code !== 'number') {
      text = code;
      code = 200;
    }

    this.writeHead(code),
    this.end(text);
  }

  var app = function (req, res) {

    var pathname = url.parse(req.url).pathname;
    var method = req.method.toLowerCase();

    if (routes.hasOwnProperty(method)) {
      if (match(pathname, routes[method])) {
        return;
      } else {
        if (match(pathname, routes.all)) {
          return;
        }
      }
    } else {
      if (match(pathname, routes.all)) {
        return;
      }
    }

    handle404(req, res);

    function match(pathname, routes) {
      for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        // here use exact match for simplicity
        // should use regex in reality
        var matched = route[0] === pathname;

        if (matched) {
          var action = route[1];
          action(req, res);
          return true;
        }
      }
      return false;
    }
  }

  app.use = function (path, action) {
    routes.all.push([path, action]);
  }

  var methods = ['get', 'post'];

  methods.forEach(function (method) {
    routes[method] = [];
    app[method] = function (path, action) {
      routes[method].push([path, action]);
    };
  });

  return app;
}

function handle404(req, res) {
  res.send(404, 'not found')
}
