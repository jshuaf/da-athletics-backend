const apn = require('apn');
const model = require('../model/model');
const co = require('co');

let provider;

module.exports.configure = (p) => {
	provider = p;
};

module.exports.sendNotificationToAll = (notification) => {
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

module.exports.sendNotification = (notification, deviceIDs) => {
	notification.topic = 'com.joshuafang.DAAthletics';
	console.log('Notification being sent to devices ', notification, deviceIDs);
	provider.send(notification, deviceIDs)
	.then((response) => {
		for (const prop in response) {
			console.log(prop, response[prop]);
		}
	}).catch((err) => {
		console.log(err);
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
		console.log(programParts, teamLevel, teamName);

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
