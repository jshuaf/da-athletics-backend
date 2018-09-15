const express = require('express');
const model = require('./model/model');
const morgan = require('morgan');
const refresh = require('./parse/refresh');
const apn = require('apn');
const bodyParser = require('body-parser');
const notify = require('./notify/notify.js');
const winston = require('winston');
require('./logs/logger');

const app = express();
const connected = model.connect().catch(() => {
	winston.error('MongoDB not connected.');
});

morgan.token('body', req => (req.body ? JSON.stringify(req.body) : ''));
app.use(
	morgan(
		':method :url :body :status :res[content-length] - :response-time ms',
		{ stream: winston.stream },
	),
);
app.use((req, res, next) => connected.then(next));

app.get('/up', require('./routes/isUp'));

app.all('*', (req, res) => res.status(400).end());

const port = process.argv.includes('--production') ? 80 : 3000;
app.listen(port, () => {
	winston.debug('Server listening on port %d.', port);
});
