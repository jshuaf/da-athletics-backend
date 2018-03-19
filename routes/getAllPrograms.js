const winston = require('winston');
const model = require('../model/model');

module.exports = (req, res) =>
	model
		.findAllPrograms()
		.then(data => {
			res.status(200).json(data);
		})
		.catch(err => {
			winston.error('Error when responding to programs request.', err);
			return res.status(400).end();
		});
