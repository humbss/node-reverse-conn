var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Constructor
function ServerProtocol(client) {
	this.client = client;
}
	
// command pront
ServerProtocol.prototype.askCommand = function () {
	
	rl.question('Enter a command (execute, status): ', (cmdType) => {
	
		if(cmdType = 'execute') {
			rl.question('Enter what you want to execute: ', (cmdArg) => {
			    var cmdToSend = {"name":"execute", "arg":cmdArg};
				this.client.write(JSON.stringify(cmdToSend));
			});
		}

	});
	
}

// protocol logic
ServerProtocol.prototype.process = function(cmd) {
	var command = JSON.parse(cmd);

	console.log('received: '+command.name);

	if(command.name == 'ack') {
		this.askCommand();
	}

	if(command.name == 'reply') {
		console.log(command.arg);
		console.log('--------------------------------------------- eof');
		this.askCommand();
	}
};

module.exports = ServerProtocol;