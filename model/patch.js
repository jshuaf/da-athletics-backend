const model = require('./model');
const co = require('co');

model.connect().then(model.findAllTeams)
.then((teams) => {
	teams.forEach((team) => {
		console.log(team._id);
		const newEvents = [];
		team.events.forEach((eventID) => {
			co(function* () {
				const event = yield model.findEvent({ _id: eventID, });
				console.log(event._id);
				if (newEvents.indexOf(event) < 0) newEvents.append(event);
			});
		});
		team.events = newEvents;
		model.updateTeam(team._id, team);
	});
});
