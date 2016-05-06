var net = require('net');

var server = net.createServer(function (socket) { //  的 接
  socket.on('data', function (data) {
    socket.write('echo: ' + data);
  });
  socket.on('end', function () {
    console.log('connect end');
  });
  socket.write('welcome! \n');
});

server.listen(8124, function () {
  console.log('server listening...');
});