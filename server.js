
const express = require('express');
const Joi = require('joi');
const model = require('./model/model');
const morgan = require('morgan');
const refresh = require('./parse/refresh');
const parse = require('./parse/parse');
const cheerio = require('cheerio');
const apn = require('apn');
const bodyParser = require('body-parser');
const requests = require('./requests/requests');
const notify = require('./notify/notify.js');

const provider = new apn.Provider({
	token: {
		key: 'APNsAuthKey_YMB3K93PU3.p8',
		keyId: 'YMB3K93PU3',
		teamId: 'RPE83CLFGM',
	},
	production: false,
});

const app = express();
const connected = model.connect();

const refreshInterval = 100000;
setInterval(() => connected.then(refresh.recent()), refreshInterval);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(morgan('dev'));

const getEventsByDateSchema = {
	startDate: Joi.date(),
	endDate: Joi.date().min(Joi.ref('startDate')),
};

app.get('/events/date', (req, res) => {
	const { error, } = Joi.validate(req.query, getEventsByDateSchema, { presence: 'required', });
	if (error) return res.status(400).end();
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
	if (error) return res.status(400).end();
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

const getEventDescriptionSchema = {
	descriptionURL: Joi.string(),
};

app.get('/events/description', (req, res) => {
	const { error, } = Joi.validate(req.query, getEventDescriptionSchema, { presence: 'required', });
	if (error) return res.status(400).end();
	connected.then(() => requests.get(req.query.descriptionURL, { update: true, })
	).then((response) => {
		const results = parse.eventDescription(cheerio.load(response.data));
		res.status(200).json(results);
	})
	.catch((err) => {
		console.log(err);
	});
});

const addDeviceSchema = {
	_id: Joi.string(),
	position: Joi.string(),
	primaryTeam: Joi.string().optional(),
	teamsWithNotifications: Joi.string().optional(),
};

app.post('/device/add', (req, res) => {
	const { error, } = Joi.validate(req.body, addDeviceSchema, { presence: 'required', });
	if (error) return res.status(400).end();
	connected.then(() => {
		const deviceData = Object.assign(req.body);
		if (deviceData.teamsWithNotifications) {
			deviceData.teamsWithNotifications = JSON.parse(deviceData.teamsWithNotifications);
		}
		model.updateDevice(deviceData._id, deviceData);
	}).then(() => {
		console.log(req.body);
		res.status(200).end();
	}).catch((err) => {
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
