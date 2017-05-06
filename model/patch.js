const model = require('./model');
const co = require('co');

/*
model.connect().then(model.findAllTeams)
.then((teams) => {
	teams.forEach((team) => {
		co(function* () {
			const program = yield model.findProgram({ _id: team.program, });
			console.log(program.name, team.level);
			const newEvents = [];
			team.events.forEach((eventID) => {
				if (newEvents.indexOf(eventID) < 0) newEvents.push(eventID);
			});
			console.log(`From ${team.events.length} events to ${newEvents.length} events.`);
			team.events = newEvents;
			model.updateTeam(team._id, team);
		}).catch(err => console.log(err));
	});
})*/
model.connect().then(model.findAllTeams)
.then((teams) => {
	teams.forEach((team) => {
		co(function* () {
			console.log(team._id);
			if (!team.devicesWithNotifications) {
				team.devicesWithNotifications = [];
			}
			yield model.updateTeam(team._id, team);
		});
	});
});
