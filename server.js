
const express = require('express');
const Joi = require('joi');
const model = require('./model/model');
const morgan = require('morgan');
const refresh = require('./parse/refresh');

const app = express();
const connected = model.connect();

const refreshInterval = 100000;
setInterval(() => connected.then(refresh.recent()), refreshInterval);

app.use(morgan('dev'));

const getEventsByDateSchema = {
	startDate: Joi.date(),
	endDate: Joi.date().min(Joi.ref('startDate')),
};

app.get('/events/date', (req, res) => {
	const { error, } = Joi.validate(req.query, getEventsByDateSchema, { presence: 'required', });
	if (error) res.status(400).end();
	connected.then(() =>
		model.findEventsByDate(req.query.startDate, req.query.endDate)
	).then((data) => {
		res.status(200).json(data);
	})
	.catch((err) => {
		console.log(err);
	});
});

const getEventsByTeamSchema = {
	teamID: Joi.string(),
};

app.get('/events/team', (req, res) => {
	const { error, } = Joi.validate(req.query, getEventsByTeamSchema, { presence: 'required', });
	if (error) res.status(400).end();
	connected.then(() =>
		model.findEventsByTeam(req.query.teamID)
	).then((data) => {
		res.status(200).json(data);
	})
	.catch((err) => {
		console.log(err);
	});
});

app.get('/programs/all', (req, res) => {
	connected.then(() =>
		model.findAllPrograms()
	).then((data) => {
		res.status(200).json(data);
	})
	.catch((err) => {
		console.log(err);
	});
});

app.get('/teams/all', (req, res) => {
	connected.then(() =>
		model.findAllTeams()
	).then((data) => {
		res.status(200).json(data);
	})
	.catch((err) => {
		console.log(err);
	});
});

app.all('*', (req, res) => {
	res.status(400).end();
});

const port = process.argv.includes('--production') ? 80 : 3000;
app.listen(port, () => {
	console.log('Listening.');
});
