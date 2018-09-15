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

app.get('/up', (req, res) => {
	res.status(200).json({ up: true });
});

const port = process.argv.includes('--production') ? 80 : 3000;
connected.then(() => {
	app.listen(port, () => {
		winston.debug('Server listening on port %d.', port);
	});
})
