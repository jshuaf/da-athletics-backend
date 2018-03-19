const Joi = require('joi');
const winston = require('winston');
const model = require('../model/model');
const axios = require('axios');
const parse = require('../parse/parse');
const cheerio = require('cheerio');

const getTeamRosterSchema = {
	teamID: Joi.string(),
};

module.exports = (req, res) => {
	const { error } = Joi.validate(req.query, getTeamRosterSchema, {
		presence: 'required',
	});
	if (error) return res.status(400).end();
	return model
		.findTeam({ _id: req.query.teamID })
		.then(team => axios.get(team.url))
		.then(response => {
			const teamRoster = parse.teamRoster(cheerio.load(response.data));
			if (teamRoster) res.status(200).json(teamRoster);
			else res.status(200).end();
		})
		.catch(err => {
			winston.error('Error when responding to teams info request.', err);
			return res.status(400).end();
		});
};
