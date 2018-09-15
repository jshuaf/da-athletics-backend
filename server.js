const express = require('express');
const model = require('./model/model');
const morgan = require('morgan');
const refresh = require('./parse/refresh');
const apn = require('apn');
const bodyParser = require('body-parser');
const notify = require('./notify/notify.js');
const winston = require('winston');
require('./logs/logger');

notify.configure(
	new apn.Provider({
		token: {
			key: 'APNsAuthKey_YMB3K93PU3.p8',
			keyId: 'YMB3K93PU3',
			teamId: 'RPE83CLFGM',
		},
		production: true,
	}),
);

const refreshRecentAndUpcoming = () =>
	connected.then(refresh.recent).then(refresh.upcoming);

const app = express();
const connected = model.connect().catch(() => {
	winston.error('MongoDB not connected.');
});

refreshRecentAndUpcoming().then(() =>
	setInterval(refreshRecentAndUpcoming, 100000),
).catch(() => {
	winston.error('Could not refresh recent and upcoming scores.')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
morgan.token('body', req => (req.body ? JSON.stringify(req.body) : ''));
app.use(
	morgan(
		':method :url :body :status :res[content-length] - :response-time ms',
		{ stream: winston.stream },
	),
);

app.get('/events/date', require('./routes/getEventsByDate'));
app.get('/events/team', require('./routes/getEventsByTeam'));
app.get('/programs/all', require('./routes/getAllPrograms'));
app.get('/teams/all', require('./routes/getAllTeams'));
app.get('/team/info', require('./routes/getTeamInfo'));
app.get('/team/roster', require('./routes/getTeamRoster'));
app.get('/event/info', require('./routes/getEventInfo'));
app.get('/events/description', require('./routes/getEventDescription'));
app.get('/up', require('./routes/isUp'));
app.post('/device/add', require('./routes/addDevice'));

app.all('*', (req, res) => res.status(400).end());

const port = process.argv.includes('--production') ? 80 : 3000;
connected.then(() => {
	app.listen(port, () => {
		winston.debug('Server listening on port %d.', port);
	});
})
