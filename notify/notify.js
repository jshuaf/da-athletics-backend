const apn = require('apn');
const model = require('../model/model');

module.exports.sendNotification = (provider, notification) => {
	notification.topic = 'com.joshuafang.DAAthletics';
	model.findAllDevices()
	.then((devices) => {
		console.log(devices.map(x => x._id));
		return provider.send(notification, devices.map(x => x._id));
	})
	.then((response) => {
		for (const prop in response) {
			console.log(prop, response[prop]);
		}
	}).catch((err) => {
		console.log(err);
	});
};
