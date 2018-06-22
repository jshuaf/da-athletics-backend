const model = require('../model/model');
const co = require('co');
const refresh = require('../parse/refresh');
const winston = require('winston');

co(function*() {
	yield model.connect();
	yield refresh.rosters();
}).catch(error => {
	console.log(error.errors);
	winston.error(error);
});
