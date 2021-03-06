const spawn = require('child_process').spawn;
const readline = require('readline');
var registeredCallback = null;
var registeredCallbackBis = null;
var child = null;
var childBis =null;

module.exports = exports = function(givenCallback, givenCallbackBis){
	registeredCallback = givenCallback;
	registeredCallbackBis = givenCallbackBis;
};

var mainProcessShutdown = false;

var initChildProcess = function() {
	child 	 = spawn("node", [__dirname + "/" + "rc522_output.js"]);
	childBis = spawn("node", [__dirname + "/" + "rc522Bis_output.js"]);
	var linereader = readline.createInterface(child.stdout, child.stdin);
	var linereaderBis = readline.createInterface(childBis.stdout, childBis.stdin);

	linereader.on('line', function (rfidTagSerialNumber) {
		if(registeredCallback instanceof Function)
		{
			registeredCallback(rfidTagSerialNumber , "rc522");
		}
	});

	child.on('close', function(code) {
		if(!mainProcessShutdown)
		{
			initChildProcess();
		}
	});

	linereaderBis.on('line', function (rfidTagSerialNumber) {
		if(registeredCallbackBis instanceof Function)
		{
			registeredCallbackBis(rfidTagSerialNumber , "rc522Bis");
		}
	});	

	childBis.on('close', function(code) {
		if(!mainProcessShutdown)
		{
			initChildProcess();
		}
	});

};

// SIGTERM AND SIGINT will trigger the exit event.
process.once("SIGTERM", function () {
	process.exit(0);
});
process.once("SIGINT", function () {
	process.exit(0);
});

// And the exit event shuts down the child.
process.once("exit", function () {
	mainProcessShutdown = true;
	child.kill();
	childBis.kill();
});

// This is a somewhat ugly approach, but it has the advantage of working
// in conjunction with most of what third parties might choose to do with
// uncaughtException listeners, while preserving whatever the exception is.
process.once("uncaughtException", function (error) {
	// If this was the last of the listeners, then shut down the child and rethrow.
	// Our assumption here is that any other code listening for an uncaught
	// exception is going to do the sensible thing and call process.exit().
	if (process.listeners("uncaughtException").length === 0) {
		mainProcessShutdown = true;
		child.kill();
		childBis.kill();
		throw error;
	}
});

initChildProcess();
