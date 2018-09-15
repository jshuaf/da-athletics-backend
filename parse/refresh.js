const cheerio = require('cheerio');
const parse = require('./parse.js');
const axios = require('axios');
const winston = require('winston');
const co = require('co');
const model = require('../model/model');
const moment = require('moment');

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

module.exports.rosters = co.wrap(function*() {
	const allTeams = yield model.findAllTeams();
	yield allTeams.map(
		co.wrap(function*(team) {
			const response = yield axios.get(team.url);
			const players = yield parse
				.teamRoster(cheerio.load(response.data))
				.filter(player => player.name !== '');
			const season = moment({"year": 2019})
				.startOf('year')
				.toDate();
			const currentRoster = yield model.findRoster({
				team: team._id,
				season,
			});
			console.log(team.url);
			if (currentRoster) {
				yield model.updateRoster(currentRoster._id, {
					players,
					season,
					team: team._id,
				});
			} else {
				yield model.addRoster({ players, season, team: team._id });
			}
		}),
	);
});

module.exports.all = year =>
	axios
		.get(`https://deerfield.edu/athletics/events/${year}`)
		.then(({ data }) => parse.refreshEvents(cheerio.load(data)))
		.then(() => {
			winston.verbose(`Refreshed scores for ${year}.`);
		});
