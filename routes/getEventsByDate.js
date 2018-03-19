const Joi = require('joi');
const winston = require('winston');
const model = require('../model/model');

const getEventsByDateSchema = {
	startDate: Joi.date(),
	endDate: Joi.date().min(Joi.ref('startDate')),
};

module.exports = (req, res) => {
	const { error } = Joi.validate(req.query, getEventsByDateSchema, {
		presence: 'required',
	});
	if (error) return res.status(400).end();
	return model
		.findEventsByDate(req.query.startDate, req.query.endDate)
		.then(data => {
			res.status(200).json(data);
		})
		.catch(err => {
			winston.error('Error when responding to event request by date.', err);
			return res.status(400).end();
		});
};
