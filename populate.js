const model = require('./model/model');
const co = require('co');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const TEAM_ID = '58c5c5d22b3146192501e5e5'; // Boys Varsity Hockey

model.connect().then(co(function* () {
	const team = yield model.findTeam({ _id: TEAM_ID, });
	const events = [];
	yield team.events.map(co.wrap(function* (eventID) {
		const event = yield model.findEvent({ _id: eventID, });
		if (['Win', 'Loss', 'Tie', ].indexOf(event.status) < 0) return;
		const eventData = {
			team: 'Boys Varsity Hockey',
			opponent: event.opponent,
			dateString: moment(event.date).format('MM/DD'),
			timeString: moment(event.date).format('H:mm A'),
			winOrLoss: event.status === 'Win' ? 'W' : 'L',
			ourScore: event.status === 'Win'
				? Math.max(event.score1, event.score2)
				: Math.min(event.score1, event.score2),
			theirScore: event.status === 'Loss'
				? Math.max(event.score1, event.score2)
				: Math.min(event.score1, event.score2),
		};
		events.push(eventData);
	}));
	fs.writeFileSync(path.join(__dirname, 'events.json'), JSON.stringify({ events, }));
}).then(() => {
	model.closeDatabase();
	console.log('Done');
}).catch((err) => {
	console.log(err);
}));
