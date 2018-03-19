const Joi = require('joi');
const winston = require('winston');
const model = require('../model/model');

const getEventInfoSchema = {
	eventID: Joi.string(),
};

module.exports = (req, res) => {
	const { error } = Joi.validate(req.query, getEventInfoSchema, {
		presence: 'required',
	});
	if (error) return res.status(400).end();
	return model
		.findEvent({ _id: parseInt(req.query.eventID, 10) })
		.then(event => {
			res.status(200).json(event);
		})
		.catch(err => {
			winston.error('Error when responding to event request.', err);
			return res.status(400).end();
		});
};
