var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Constructor
function ServerProtocol() {
	//this.client = sockets[0]; //TODO REM
	//this.sockets = sockets;
}

ServerProtocol.prototype.updateSockets = function(sockets) {
	this.sockets = sockets;
}

// command pront
ServerProtocol.prototype.askCommand = function () {
	rl.question('\nEnter a command (execute, list): ', (cmdType) => {
	
		// Execute command
		if(cmdType == 'execute') {
			rl.question('Enter what you want to execute: ', (cmdArg) => {

				if(cmdArg == '') {
					console.log('so, nothing?');
					this.askCommand();
				}

				rl.question('Client id: ', (cmdCliId) => {
					if(cmdCliId == '') {
						console.log('client id is mandatory');
						this.askCommand();
						return;
					}

					var cmdToSend = {"name":"execute", "arg":cmdArg};
					this.sockets[cmdCliId].write(JSON.stringify(cmdToSend));
					this.askCommand(); //re ask for some command
				});
			});
		} else {
			// List command
			if(cmdType == 'list') {
				if(this.sockets.length == 0) {
					console.log('0 clients connected');
				} else {
					this.updateSockets(this.sockets.filter(function(n){ return n.remoteAddress != undefined })); // make sure there is no dead sockets.
					console.log(this.sockets.length+' clients connected');
					for (var i = 0; i < this.sockets.length; i ++) { 
						console.log("["+i+"] - " +this.sockets[i].remoteAddress + " - "+ this.sockets[i].writable);
		      	    }
	      		}
	      		this.askCommand();
				return;
			} else {
				// Invalid command
				console.log('grrr invalid command, should it be so hard?');
				this.askCommand();
			}
		} 
	});
}

// protocol logic
ServerProtocol.prototype.process = function(cmd) {
	var command = JSON.parse(cmd);

	//console.log('received: '+command.name);
	if(command.name == 'ack') {
		this.askCommand();
	}

	if(command.name == 'reply' && command.arg != undefined && command.arg != '') {
		console.log(command.arg);
	}
};

module.exports = ServerProtocol;