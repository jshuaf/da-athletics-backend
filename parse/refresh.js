const cheerio = require('cheerio');
const parse = require('./parse.js');
const axios = require('axios');
const winston = require('winston');

module.exports.recent = () =>
	axios
		.get('https://deerfield.edu/athletics/events/recent-scores/')
		.then(({ data }) => parse.refreshEvents(cheerio.load(data)))
		.then(() => {
			winston.verbose('Refreshed all recent scores.');
		});

module.exports.test = () =>
	axios
		.get('https://deerfield.edu/athletics/teams/junior-varsity-boys-tennis/')
		.then(({ data }) => parse.refreshEvents(cheerio.load(data)))
		.then(() => {
			winston.verbose('Refreshed test team.');
		});

module.exports.upcoming = () =>
	axios
		.get('https://deerfield.edu/athletics/events/')
		.then(({ data }) => parse.refreshEvents(cheerio.load(data)))
		.then(() => {
			winston.verbose('Refreshed all upcoming scores.');
		});

module.exports.all = year =>
	axios
		.get(`https://deerfield.edu/athletics/events/${year}`)
		.then(({ data }) => parse.refreshEvents(cheerio.load(data)))
		.then(() => {
			winston.verbose(`Refreshed scores for ${year}.`);
		});
