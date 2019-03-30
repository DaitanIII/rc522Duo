const rc522Bis = require('./build/Release/rc522Due');

rc522Bis(function(rfidTagSerialNumber) {
	console.log("Tag RFID code %s from RFID reader %s ",rfidTagSerialNumber, "rc522Due");
});