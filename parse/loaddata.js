const cheerio = require('cheerio');
const model = require('../model/model');
const moment = require('moment-timezone');
const requests = require('../requests/requests');
const co = require('co');
const Promise = require('bluebird');

moment.tz.setDefault('America/New_York');

function addTeamFromData(url) {
	return co(function* () {
		const teamData = {};
		const response = yield requests.get(url);
		const $ = cheerio.load(response.data);
		teamData.level = $('.h-menu-active').text().trim();
		teamData.url = url;
		let programName;
		let programURL;
		let term;
		if (url === 'https://deerfield.edu/athletics/teams/crew-coed-junior-varsity/') {
			programName = 'Crew, Coed: Junior Varsity';
			programURL = url;
			term = 'Spring';
		} else {
			programName = $('.current-menu-item').text().trim();
			programURL = $('.current-menu-item').find('a').first().attr('href');
			term = $('.current-menu-item').parent().prev().text();
		}

		const existingProgram = yield model.findProgram({ name: programName, url: programURL, });
		const program = yield existingProgram
			? model.updateProgram(existingProgram._id, { name: programName, url: programURL, term, })
			: model.addProgram({ name: programName, url: programURL, term, });
		teamData.program = program._id;
		const team = yield model.findOrAddTeam(teamData);
		program.teams.push(team._id);
		yield program.save();
		return team;
	}).catch((err) => {
		console.log(err);
	});
}

function refreshAllEvents($) {
	const eventsTable = $('.event-archive-container');
	return Promise.map(eventsTable.find('.athletic-event-row').toArray(), (event, i) => {
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
				const team = yield addTeamFromData(teamURL);
				eventData.team = team._id;
				team.events.push(eventData._id);
				yield team.save();
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
					return model.updateEvent(eventData._id, { $set: eventData, });
				}
				return model.addEvent(eventData);
			})
			.then(savedEvent => console.log(`Completed event ${i}, with ID ${savedEvent._id}`))
			.catch(err => console.log(err));
	}, { concurrency: 20, });
}

model.connect().then(() => {
	requests.get('https://deerfield.edu/athletics/events/2016')
	.then(({ data, }) => {
		refreshAllEvents(cheerio.load(data))
		.then(() => {
			model.closeDatabase();
			console.log('Done');
		});
	});
});
