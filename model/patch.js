const model = require('./model');
const co = require('co');

model.connect().then(model.findAllTeams)
.then((teams) => {
	teams.forEach((team) => {
		console.log(team._id);
		const newEvents = [];
		team.events.forEach((eventID) => {
			co(function* () {
				if (newEvents.indexOf(eventID) < 0) newEvents.append(eventID);
			});
		});
		team.events = newEvents;
		model.updateTeam(team._id, team);
	});
});
