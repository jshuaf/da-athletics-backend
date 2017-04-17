const cheerio = require('cheerio');
const parse = require('./parse.js');
const model = require('../model/model');
const requests = require('../requests/requests');

module.exports.recent = () => {
	requests.get('https://deerfield.edu/athletics/events/recent-scores/')
	.then(({ data, }) => {
		parse.refreshEvents(cheerio.load(data))
		.then(() => {
			console.log('Refreshed all recent scores.');
		});
	});
};

module.exports.all = () => {
	requests.get('https://deerfield.edu/athletics/events/2016')
	.then(({ data, }) => {
		parse.refreshEvents(cheerio.load(data))
		.then(() => {
			console.log('Refreshed all scores.');
		});
	});
};
