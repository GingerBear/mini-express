### Mini Express
-----
#### comparing http native module vs express

Express is a wrapper around `callback` in `http.createServer(callback)`

```js
// http.js
var http = require('http');

var app = function (req, res) {
  res.writeHead(200);
  res.end('Hello World\n');
};

http.createServer(app)
  .listen(1337, '127.0.0.1');
```

```js
// express/app-1.js
var app = express();

app.use('/', function(req, res) {
  res.send('hello express');
});

app.use('/haha', function(req, res) {
  res.send('haha express');
});

http.createServer(app)
  .listen(3000, '127.0.0.1');
```

#### url routing api and implementaion
```js
// express-mini/app-1.js
var app = express();

app.use('/', function(req, res) {
  res.send('hello express');
});
```

```js
// express-mini/express-1.js
function express() {

  var routes = [];

  // add send function to http native ServerResponse object
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
      // here use exact match for simplicity
      // should use regex in reality
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

```

#### method routing api and implementaion

```js
// express-mini/app-2.js
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
```

```js
// express-mini/express-2.js
function express() {

  // give each method a list of route
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

  // fill the routes into each method
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

```

#### middleware api and implementaion

```js
// express-mini/app-3.js
var app = express();

app.use(middleware1);

app.get('/', middleware2, middleware3, function(req, res) {
  res.send('hello mini express');
});

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
```

```js
// express-mini/express-3.js
function express() {

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

    // push each matched middleware of all method into a stack
    var stacks = match(pathname, routes.all);

    // push each matched middleware of http method into a stack
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

// call the next() function recursively
function handle (req, res, stack) {
  var next = function () {
    var middleware = stack.shift();
    if (middleware) {
      middleware(req, res, next);
    }
  };
  next();
}
```