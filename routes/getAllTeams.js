const winston = require('winston');
const model = require('../model/model');

module.exports = (req, res) =>
	model
		.findAllTeams()
		.then(data => {
			res.status(200).json(data);
		})
		.catch(err => {
			winston.error('Error when responding to teams request.', err);
			return res.status(400).end();
		});
