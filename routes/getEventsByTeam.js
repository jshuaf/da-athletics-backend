const Joi = require('joi');
const winston = require('winston');
const model = require('../model/model');

const getEventsByTeamSchema = {
	teamID: Joi.string(),
};

module.exports = (req, res) => {
	const { error } = Joi.validate(req.query, getEventsByTeamSchema, {
		presence: 'required',
	});
	if (error) return res.status(400).end();
	return model
		.findEventsByTeam(req.query.teamID)
		.then(data => {
			res.status(200).json(data);
		})
		.catch(err => {
			winston.error('Error when responding to event request by team.', err);
			return res.status(400).end();
		});
};

