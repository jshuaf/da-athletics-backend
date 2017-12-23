const cheerio = require('cheerio');
const parse = require('./parse.js');
const requests = require('../requests/requests');
const winston = require('winston');

module.exports.recent = () =>
	requests
		.get('https://deerfield.edu/athletics/events/recent-scores/', {
			update: true,
		})
		.then(({ data }) => parse.refreshEvents(cheerio.load(data)))
		.then(() => {
			winston.verbose('Refreshed all recent scores.');
		});

module.exports.test = () =>
	requests
		.get('https://deerfield.edu/athletics/teams/junior-varsity-boys-tennis/', {
			update: true,
		})
		.then(({ data }) => parse.refreshEvents(cheerio.load(data)))
		.then(() => {
			winston.verbose('Refreshed test team.');
		});

module.exports.upcoming = () =>
	requests
		.get('https://deerfield.edu/athletics/events/', { update: true })
		.then(({ data }) => parse.refreshEvents(cheerio.load(data)))
		.then(() => {
			winston.verbose('Refreshed all upcoming scores.');
		});

module.exports.all = year =>
	requests
		.get(`https://deerfield.edu/athletics/events/${year}`, { update: true })
		.then(({ data }) => parse.refreshEvents(cheerio.load(data)))
		.then(() => {
			winston.verbose(`Refreshed scores for ${year}.`);
		});
