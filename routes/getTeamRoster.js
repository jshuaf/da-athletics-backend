const Joi = require('joi');
const model = require('../model/model');
const winston = require('winston');

const getTeamRosterSchema = {
	teamID: Joi.string(),
	season: Joi.date(),
};

module.exports = (req, res) => {
	const { error } = Joi.validate(req.query, getTeamRosterSchema, {
		presence: 'required',
	});
	if (error) {
		winston.error(error);
		return res.status(400).end();
	}
	console.log(req.query.teamID, req.query.season)
	model
		.findRosterByTeamAndSeason({
			teamID: req.query.teamID,
			season: req.query.season,
		})
		.then(roster => {
			res.status(200).json(roster);
		});
};
