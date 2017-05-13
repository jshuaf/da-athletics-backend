const cheerio = require('cheerio');
const model = require('../model/model');
const moment = require('moment');
const requests = require('../requests/requests');
const co = require('co');
const Promise = require('bluebird');
const notify = require('../notify/notify');

module.exports.addTeamFromData = url => co(function* () {
	const teamData = {};
	const response = yield requests.get(url);
	const $ = cheerio.load(response.data);
	teamData.level = $('.h-menu-active').text().trim();
	teamData.url = url;
	if (teamData.level === 'Overview') {
		teamData.level = 'Varsity';
		teamData.url = $('.h-menu-active').next().find('a').first()
				.attr('href');
	}
	let programName;
	let programURL;
	let term;
	if (url === 'https://deerfield.edu/athletics/teams/crew-coed-junior-varsity/') {
		programName = 'Crew, Coed';
		programURL = 'https://deerfield.edu/athletics/teams/crew-coed/';
		term = 'Spring';
		teamData.level = 'Junior Varsity';
		teamData.url = url;
	} else {
		programName = $('.current-menu-item').text().trim();
		programURL = $('.current-menu-item').find('a').first().attr('href');
		term = $('.current-menu-item').parent().prev().text();
	}

	const existingProgram = yield model.findProgram({ url: programURL, });
	const program = yield existingProgram
			? model.updateProgram(existingProgram._id, { name: programName, url: programURL, term, })
			: model.addProgram({ name: programName, url: programURL, term, });
	teamData.program = program._id;
	const team = yield model.findOrAddTeam(teamData);
	if (program.teams.indexOf(team._id) < 0) program.teams.push(team._id);
	yield program.save();
	return team;
}).catch((err) => {
	console.log(err);
});

module.exports.refreshEvents = ($) => {
	const eventsTable = $('.event-archive-container');
	return Promise.map(eventsTable.find('.athletic-event-row').toArray(), (event) => {
		const eventData = { date: new Date(0), };
		eventData._id = $(event).attr('id').replace('post-', '');
		const rawData = $(event).find('td').toArray().map(co.wrap(function* (eventDetail) {
			const text = $(eventDetail).text().trim().replace(/\t/gi, '');
			switch ($(eventDetail).attr('class')) {
			case 'athletic-event-date': {
				const date = moment(text, 'MMM-D-YY');
				if (!date.isValid()) break;
				eventData.date = moment(eventData.date).set({
					year: date.year(),
					month: date.month(),
					date: date.date(),
				}).toDate();
				break;
			}
			case 'athletic-event-time': {
				const time = moment(text, 'hh-mm-a');
				if (!time.isValid()) break;
				eventData.date = moment(eventData.date).set({
					hour: time.hour(),
					minute: time.minute(),
				}).toDate();
				break;
			}
			case 'event-details': {
				const teamURL = $(eventDetail).find('a').first().attr('href');
				if (!teamURL) break;
				const team = yield module.exports.addTeamFromData(teamURL);
				eventData.team = team._id;
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
				const descriptionURL = $(eventDetail).find('a').first().attr('href');
				if (descriptionURL) eventData.descriptionURL = descriptionURL;
				const scoreData = text.match(/\b(Win|Loss|Tie)\b - (\d+)-(\d+)/);
				if (scoreData) {
					eventData.status = scoreData[1];
					eventData.score1 = parseInt(scoreData[2], 10);
					eventData.score2 = parseInt(scoreData[3], 10);
				} else if (text.indexOf('Cancel') >= 0) {
					eventData.status = 'Cancelled';
				} else if (text.indexOf('Scrimmage') >= 0) {
					eventData.status = 'Scrimmage';
				} else if (text.length === 0 || text === 'Live Stream') {
					eventData.status = 'Unscored';
				} else {
					eventData.status = 'Other';
				}
				break;
			}
			default: break;
			}
		}));
		return Promise.all(rawData)
			.then(() => model.findEvent({ _id: eventData._id, }))
			.then((currentEvent) => {
				if (currentEvent) {
					if (currentEvent.status === 'Unscored' && eventData.status !== 'Unscored') {
						notify.notifyEvent(eventData);
					}
					return model.updateEvent(eventData._id, { $set: eventData, });
				}
				return model.addEvent(eventData);
			})
			.then(savedEvent => console.log(`Event: date ${savedEvent.date}, team ${savedEvent.team} vs ${savedEvent.opponent}, ID ${savedEvent._id}, status ${savedEvent.status}`))
			.catch(err => console.log(err));
	}, { concurrency: 30, });
};

module.exports.eventDescription = $ => ({
	header: $('.h-t').text().trim(),
	description: $('.entry-content').text().trim(),
});
