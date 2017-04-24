const model = require('./model');
const co = require('co');

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
			team.events = newEvents;
			model.updateTeam(team._id, team);
		}).catch(err => console.log(err));
	});
});
