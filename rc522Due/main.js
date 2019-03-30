const spawn = require('child_process').spawn;
const readline = require('readline');
var registeredCallback = null;
var registeredCallbackBis = null;
var child = null;
var childDue =null;

module.exports = exports = function(givenCallback){
	registeredCallback = givenCallback;
};

var mainProcessShutdown = false;

var initChildProcess = function() {
	child = spawn("node", [__dirname + "/" + "rc522Uno_output.js"]);
	//child = spawn("node", [__dirname + "/" + "rc522Due_output.js"]);
	var linereader = readline.createInterface(child.stdout, child.stdin);

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
};

var initChildProcessBis = function() {

	childDue = spawn("node", [__dirname + "/" + "rc522Bis_output.js"]);
	var linereaderBis = readline.createInterface(childDue.stdout, childDue.stdin);

	linereaderBis.on('line', function (rfidTagSerialNumber) {
		if(registeredCallback instanceof Function)
		{
			registeredCallback(rfidTagSerialNumber , "rc522");
		}
	});	

	childDue.on('close', function(code) {
		if(!mainProcessShutdown)
		{
			initChildProcessBis();
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
	//childDue.kill();
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
		//childDue.kill();
		throw error;
	}
});

initChildProcess();
//initChildProcessBis();
