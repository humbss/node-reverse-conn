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
var protocol = function (d) {
	var command = JSON.parse(decoder.write(d));
	
	// execute command
	if(command.name == "execute") {
		const child = exec(command.arg,
		  (error, stdout, stderr) => {
		        client.write(JSON.stringify({"name":"reply", "arg":stdout}));
		});
	}

	// status command
	// TODO
}

/**
 * Client ops
 */
client.on('data', function(data) {
  	protocol(data);
});

client.on('close', function() {
	console.log('Connection closed');
});

client.connect(1337, '127.0.0.1', function() {
	console.log('Connected');
	client.write(JSON.stringify({"name":"ack", "arg":""}));
});