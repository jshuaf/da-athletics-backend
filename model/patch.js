const model = require('./model');
const co = require('co');
const winston = require('winston');

model
	.connect()
	.then(model.findAllTeams)
	.then(teams => {
		teams.forEach(team => {
			co(function*() {
				winston.debug(team._id);
				if (!team.devicesWithNotifications) {
					team.devicesWithNotifications = [];
				}
				yield model.updateTeam(team._id, team);
			});
		});
	});
