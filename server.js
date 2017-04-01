const express = require('express');
const Joi = require('joi');
const model = require('./model/model');

const app = express();
const connected = model.connect();

const getEventsSchema = {
	startDate: Joi.date(),
	endDate: Joi.date().min(Joi.ref('startDate')),
};

app.get('/events', (req, res) => {
	const { error, } = Joi.validate(req.query, getEventsSchema, { presence: 'required', });
	if (error) res.status(400).end();

	connected.then(() =>
		model.findEventsByDate(req.query.startDate, req.query.endDate)
	).then((data) => {
		res.status(200).json(data).end();
	})
	.then(() => model.close())
	.catch((err) => {
		console.log(err);
		model.close();
	});
});

const port = process.argv.includes('--production') ? 80 : 3000;
app.listen(port, () => {
	console.log('Listening.');
});
