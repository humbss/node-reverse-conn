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
	rl.question('Enter a command: ', (commandToSend) => {
		  this.client.write(commandToSend);
	});
}

// protocol logic
ServerProtocol.prototype.process = function(cmd) {
	if(cmd.contains("srv-ack")) {
		console.log('Server ack received.');
		this.askCommand();
	}

	if(cmd.contains("reply")) {
		var arg = cmd.split("#")[1];
		console.log(arg+'\n\n');
		this.askCommand();
	}
};

module.exports = ServerProtocol;