var net = require('net');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var serverProtocol = require('./server-protocol.js');

/** 
 * DEFS 
 */
if (typeof String.prototype.contains === 'undefined') { String.prototype.contains = function(it) { return this.indexOf(it) != -1; }; }

var sockets = [];

/* init client protocol */
var protocol = new serverProtocol();

/* Remove dead socket */
function removeMe(s) {
  var idx = sockets.indexOf(s);
  if (idx != -1) {
       delete sockets[idx];
       s.destroy();
       protocol.updateSockets(sockets.filter(function(n){ return n.remoteAddress != undefined })); 
  }
}

var server = net.createServer(function(socket) {
  socket.pipe(socket);
  sockets.push(socket);

  protocol.updateSockets(sockets);

  socket.on('data', function(data) {
    var cmd = decoder.write(data);
    protocol.process(cmd);
  });

  socket.on('error', function(ex) {
	removeMe(socket);
  });

  socket.on('end', function() { // client disconnects
  	removeMe(socket);
  });
});

server.listen(1337, '127.0.0.1');