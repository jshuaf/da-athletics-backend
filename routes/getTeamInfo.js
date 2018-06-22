const Joi = require('joi');
const winston = require('winston');
const model = require('../model/model');

const getTeamInfoSchema = {
	teamID: Joi.string(),
};

module.exports = (req, res) => {
	const { error } = Joi.validate(req.query, getTeamInfoSchema, {
		presence: 'required',
	});
	if (error) {
		winston.error(error);
		return res.status(400).end();
	}
	return model
		.findTeam({ _id: req.query.teamID })
		.then(team => {
			res.status(200).json(team);
		})
		.catch(err => {
			winston.error('Error when responding to teams info request.', err);
			return res.status(400).end();
		});
};
