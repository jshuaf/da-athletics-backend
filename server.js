const express = require('express');
const Joi = require('joi');
const model = require('./model/model');

const app = express();
const connected = model.connect();

const getEventsByDateSchema = {
	startDate: Joi.date(),
	endDate: Joi.date().min(Joi.ref('startDate')),
};

app.get('/events/date', (req, res) => {
	const { error, } = Joi.validate(req.query, getEventsByDateSchema, { presence: 'required', });
	if (error) res.status(400).end();
	console.log('Query for events by date.', req.query);
	connected.then(() =>
		model.findEventsByDate(req.query.startDate, req.query.endDate)
	).then((data) => {
		console.log('Query successful.');
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
	console.log('Query for events by team.', req.query);
	connected.then(() =>
		model.findEventsByTeam(req.query.teamID)
	).then((data) => {
		console.log('Query successful.');
		res.status(200).json(data);
	})
	.catch((err) => {
		console.log(err);
	});
});

app.get('/programs/all', (req, res) => {
	console.log('Query for all programs.');
	connected.then(() =>
		model.findAllPrograms()
	).then((data) => {
		console.log('Query successful.');
		res.status(200).json(data);
	})
	.catch((err) => {
		console.log(err);
	});
});

app.get('/teams/all', (req, res) => {
	console.log('Query for all teams.');
	connected.then(() =>
		model.findAllTeams()
	).then((data) => {
		console.log('Query successful.');
		res.status(200).json(data);
	})
	.catch((err) => {
		console.log(err);
	});
});

const port = process.argv.includes('--production') ? 80 : 3000;
app.listen(port, () => {
	console.log('Listening.');
});
