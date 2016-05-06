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
    var stacks = match(pathname, routes.all);

    if (routes.hasOwnProperty(method)) {
      stacks = stacks.concat(match(pathname, routes[method]));
    }

    if (stacks.length) {
      handle(req, res, stacks)
    } else {
      handle404(req, res);
    }

    function match(pathname, routes) {
      var stacks = [];
      for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        // here use exact match for simplicity
        // should use regex in reality
        var matched = route.path === pathname;

        if (matched || route.path === '*') {
          stacks = stacks.concat(route.stack);
          return stacks;
        }
      }
      return stacks;
    }
  }

  app.use = function (path) {
    if (typeof path === 'string') {
      var handle = {
        path: path,
        stack: Array.prototype.slice.call(arguments, 1)
      };
    } else {
      var handle = {
        path: '*',
        stack: Array.prototype.slice.call(arguments, 0)
      };
    }

    routes.all.push(handle);
  }

  var methods = ['get', 'post'];

  methods.forEach(function (method) {
    routes[method] = [];
    app[method] = function (path) {
      var handle = {
        path: path,
        stack: Array.prototype.slice.call(arguments, 1)
      };
      routes[method].push(handle);
    };
  });

  return app;
}

function handle404(req, res) {
  res.send(404, 'not found')
}

function handle (req, res, stack) {
  var next = function () {
    var middleware = stack.shift();
    if (middleware) {
      middleware(req, res, next);
    }
  };
  next();
};