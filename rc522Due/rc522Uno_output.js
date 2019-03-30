const rc522 = require('./build/Release/rc522Uno');

rc522(function(rfidTagSerialNumber) {
	console.log("Tag RFID code %s from RFID reader %s ",rfidTagSerialNumber, "rc522Uno");
});
