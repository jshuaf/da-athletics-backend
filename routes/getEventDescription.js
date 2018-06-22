const Joi = require('joi');
const winston = require('winston');
const axios = require('axios');
const parse = require('../parse/parse');
const cheerio = require('cheerio');

const getEventDescriptionSchema = {
	descriptionURL: Joi.string(),
};

module.exports = (req, res) => {
	const { error } = Joi.validate(req.query, getEventDescriptionSchema, {
		presence: 'required',
	});
	if (error) {
		winston.error(error);
		return res.status(400).end();
	}
	return axios
		.get(req.query.descriptionURL)
		.then(response => {
			const results = parse.eventDescription(cheerio.load(response.data));
			res.status(200).json(results);
		})
		.catch(err => {
			winston.error('Error when responding to event description request.', err);
			return res.status(400).end();
		});
};
