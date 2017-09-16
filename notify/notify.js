const apn = require('apn');
const model = require('../model/model');
const co = require('co');
const winston = require('winston');

let provider;

module.exports.configure = (p) => {
	provider = p;
};

module.exports.sendNotificationToAll = (notification) => {
	notification.topic = 'com.joshuafang.DAAthletics';
	model
		.findAllDevices()
		.then((devices) => {
			winston.info('Sending notification to %d devices.', devices.length, notification);
			return provider.send(notification, devices.map(x => x._id));
		})
		.catch((err) => {
			winston.error('Error when sending notification to all devices.', err);
		});
};

module.exports.sendNotification = (notification, deviceIDs) => {
	notification.topic = 'com.joshuafang.DAAthletics';
	provider
		.send(notification, deviceIDs)
		.then((response) => {
			winston.info('Notification sent to devices.', { notification, response, });
		})
		.catch((err) => {
			winston.error('Error when sending notification to devices.', err);
		});
};

module.exports.notifyEvent = (event) => {
	co(function* () {
		const team = yield model.findTeam({ _id: event.team, });
		const program = yield model.findProgram({ _id: team.program, });
		const programParts = program.name.split(', ');
		let teamLevel = team.level;
		if (teamLevel === 'Junior Varsity') teamLevel = 'JV';
		let teamName;
		if (programParts.length === 1) {
			teamName = `${teamLevel} ${programParts[0]}`;
		} else if (programParts.length === 2) {
			teamName = `${programParts[1]} ${teamLevel} ${programParts[0]}`;
		}

		let alert;
		if (event.status === 'Win') {
			if (typeof event.score1 !== 'undefined' && typeof event.score2 !== 'undefined') {
				alert = `${teamName} won against ${event.opponent}, ${event.score1} - ${event.score2}.`;
			} else {
				alert = `${teamName} won against ${event.opponent}.`;
			}
		} else if (event.status === 'Loss') {
			if (event.score1 && event.score2) {
				alert = `${teamName} lost against ${event.opponent}, ${event.score1} - ${event.score2}.`;
			} else {
				alert = `${teamName} lost against ${event.opponent}.`;
			}
		} else if (event.status === 'Cancelled') {
			alert = `${teamName}'s event against ${event.opponent} has been cancelled.`;
		} else {
			alert = `${teamName} finished their event against ${event.opponent}.`;
		}
		const notification = new apn.Notification({
			alert,
			badge: 1,
		});
		notification.payload.event = event._id;
		return exports.sendNotification(notification, team.devicesWithNotifications);
	});
};
