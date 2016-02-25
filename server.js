var net = require('net');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var serverProtocol = require('./server-protocol.js');

/** 
 * DEFS 
 */
if (typeof String.prototype.contains === 'undefined') { String.prototype.contains = function(it) { return this.indexOf(it) != -1; }; }


console.log('command list :D \n');
console.log('cmd#dir c: \n');

var server = net.createServer(function(socket) {
  socket.pipe(socket);

  /* init client protocol */
  var protocol = new serverProtocol(socket);

  socket.on('data', function(data) {
    var cmd = decoder.write(data);
    protocol.process(cmd);
  });
});

server.listen(1337, '127.0.0.1');