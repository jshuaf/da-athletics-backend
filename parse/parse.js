const cheerio = require('cheerio');
const model = require('../model/model');
const moment = require('moment');
const axios = require('axios');
const co = require('co');
const Promise = require('bluebird');
const notify = require('../notify/notify');
const winston = require('winston');

module.exports.addTeamFromData = url =>
	co(function*() {
		const teamData = {};
		const existingTeam = yield model.findTeam({ url });
		if (existingTeam) return existingTeam;
		const response = yield axios.get(url);
		const $ = cheerio.load(response.data);
		teamData.level = $('.h-menu-active')
			.text()
			.trim();
		teamData.url = url;
		if (teamData.level === 'Overview') {
			teamData.level = 'Varsity';
			teamData.url = $('.h-menu-active')
				.next()
				.find('a')
				.first()
				.attr('href');
		}
		let programName;
		let programURL;
		let term;
		if (
			url ===
			'https://deerfield.edu/athletics/teams/rowing-coed-junior-varsity/'
		) {
			programName = 'Rowing, Coed';
			programURL = 'https://deerfield.edu/athletics/teams/rowing-coed/';
			term = 'Spring';
			teamData.level = 'Junior Varsity';
			teamData.url = url;
		} else if (
			url ===
			'https://deerfield.edu/athletics/teams/varsity-coed-track-and-field/'
		) {
			programName = 'Track & Field, Coed';
			programURL =
				'https://deerfield.edu/athletics/teams/track-and-field-coed/';
			term = 'Spring';
			teamData.level = 'Varsity';
			teamData.url = url;
		} else {
			programName = $('.current-menu-item')
				.text()
				.trim();
			programURL = $('.current-menu-item')
				.find('a')
				.first()
				.attr('href');
			term = $('.current-menu-item')
				.parent()
				.prev()
				.text();
		}
		const existingProgram = yield model.findProgram({ url: programURL });
		const program = yield existingProgram
			? model.updateProgram(existingProgram._id, {
					name: programName,
					url: programURL,
					term,
				})
			: model.addProgram({ name: programName, url: programURL, term });
		teamData.program = program._id;
		const team = yield model.findOrAddTeam(teamData);
		if (program.teams.indexOf(team._id) < 0) program.teams.push(team._id);
		console.log(program.url);
		yield program.save();
		return team;
	}).catch(err => {
		winston.error('Error adding team when parsing.', err);
	});

module.exports.refreshEvents = $ => {
	const eventsTable = $('.event-archive-container');
	return Promise.map(
		eventsTable.find('.athletic-event-row').toArray(),
		event => {
			const eventData = { date: new Date(0) };
			eventData._id = $(event)
				.attr('id')
				.replace('post-', '');
			const rawData = $(event)
				.find('td')
				.toArray()
				.map(
					co.wrap(function*(eventDetail) {
						const text = $(eventDetail)
							.text()
							.trim()
							.replace(/\t/gi, '');
						switch ($(eventDetail).attr('class')) {
							case 'athletic-event-date': {
								const date = moment(text, 'MMM-D-YY');
								if (!date.isValid()) break;
								eventData.date = moment(eventData.date)
									.set({
										year: date.year(),
										month: date.month(),
										date: date.date(),
									})
									.toDate();
								break;
							}
							case 'athletic-event-time': {
								const time = moment(text, 'hh-mm-a');
								if (!time.isValid()) break;
								eventData.date = moment(eventData.date)
									.set({
										hour: time.hour(),
										minute: time.minute(),
									})
									.toDate();
								break;
							}
							case 'event-details': {
								const teamURL = $(eventDetail)
									.find('a')
									.first()
									.attr('href');
								if (!teamURL) break;
								const team = yield module.exports.addTeamFromData(teamURL);
								try {
									eventData.team = team._id;
								} catch (err) {
									console.log(teamURL);
								}
								if (team.events.indexOf(eventData._id) < 0) {
									team.events.push(eventData._id);
									yield team.save();
								}
								break;
							}
							case 'event-opponent':
								eventData.opponent = text;
								break;
							case 'event-location':
								eventData.location = text;
								break;
							case 'athletic-event-status': {
								const descriptionURL = $(eventDetail)
									.find('a')
									.first()
									.attr('href');
								if (descriptionURL) eventData.descriptionURL = descriptionURL;
								const scoreData =
									text.match(/\b(Win|Loss|Tie)\b - (\d+)-(\d+)/) ||
									text.match(/\b(Win|Loss|Tie)\b - DA (\d+) - \w+ (\d+)/);
								eventData.statusText = text;
								if (scoreData) {
									eventData.status = scoreData[1];
									eventData.score1 = parseInt(scoreData[2], 10);
									eventData.score2 = parseInt(scoreData[3], 10);
								} else if (text.indexOf('Cancel') >= 0) {
									eventData.status = 'Cancelled';
								} else if (text.indexOf('Scrimmage') >= 0) {
									eventData.status = 'Scrimmage';
								} else if (text.indexOf('Win') >= 0) {
									eventData.status = 'Win';
								} else if (text.indexOf('Loss') >= 0) {
									eventData.status = 'Loss';
								} else if (text.length === 0 || text === 'Live Stream') {
									eventData.status = 'Unscored';
								} else {
									eventData.status = 'Other';
								}
								break;
							}
							default:
								break;
						}
					}),
				);
			return Promise.all(rawData)
				.then(() => model.findEvent({ _id: eventData._id }))
				.then(currentEvent => {
					if (currentEvent) {
						if (
							currentEvent.status === 'Unscored' &&
							eventData.status !== 'Unscored'
						) {
							// notify.notifyEvent(eventData);
						}
						return model.updateEvent(eventData._id, { $set: eventData });
					}
					return model.addEvent(eventData);
				})
				.then(savedEvent => {
					winston.verbose(
						'Event saved',
						JSON.parse(JSON.stringify(savedEvent.toObject())),
					);
				})
				.catch(err => winston.error('Error adding new events.', err));
		},
		{ concurrency: 30 },
	);
};

module.exports.eventDescription = $ => ({
	header: $('.h-t')
		.text()
		.trim(),
	description: $('.entry-content')
		.text()
		.trim(),
});

module.exports.teamRoster = $ => {
	const rows = $('table', '#roster').find('tr');
	if (!rows) return false;
	const headings = $(rows[0])
		.find('td')
		.map((i, el) => $(el).text())
		.toArray()
		.map(x => (x.indexOf('#') > 0 ? '#' : x.toLowerCase()));
	const athletes = [];
	rows.slice(1, -1).each((i, athleteRow) => {
		const rowData = $(athleteRow)
			.find('td')
			.map((_, el) => $(el).text())
			.toArray();
		const athleteData = {};
		rowData.forEach((col, j) => {
			if (headings[j] === 'name' && col.slice(-1) === '*') {
				col = col.slice(0, -1);
				athleteData.captain = true;
			} else if (col === 'Manager') {
				athleteData.manager = true;
			}
			athleteData[headings[j]] = col;
		});
		athleteData.captain = !!athleteData.captain;
		athleteData.manager = !!athleteData.manager;
		athletes.push(athleteData);
	});
	return athletes;
};
