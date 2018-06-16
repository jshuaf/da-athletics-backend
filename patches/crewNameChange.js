const model = require('../model/model');
const Program = require('../model/Program');
const Team = require('../model/Team');
const co = require('co');

co(function*() {
	yield model.connect();
	const boysprogram = yield Program.find({ name: 'Crew, Boys' });
	const boysteams = yield Team.find({ program: boysprogram._id });
	yield boysteams.map(team =>
		co(function*() {
			yield Team.remove({ _id: team._id });
		}),
	);
	yield Program.remove({ _id: boysprogram });

	const girlsprogram = yield Program.find({ name: 'Crew, Girls' });
	const girlsteams = yield Team.find({ program: girlsprogram._id });
	yield girlsteams.map(
		team =>
			function*() {
				yield Team.remove({ _id: team._id });
			},
	);
	yield Program.remove({ _id: girlsprogram });

	const coedprogram = yield Program.find({ name: 'Crew, Coed' });
	const coedteams = yield Team.find({ program: coedprogram._id });
	yield coedteams.map(team =>
		co(function*() {
			yield Team.remove({ _id: team._id });
		}),
	);
	yield Program.remove({ _id: coedprogram });

	const coedprogram2 = yield Program.find({
		name: 'Crew, Coed: Junior Varsity',
	});
	const coedteams2 = yield Team.find({ program: coedprogram2._id });
	yield coedteams2.map(team =>
		co(function*() {
			yield Team.remove({ _id: team._id });
		}),
	);
	yield Program.remove({ _id: coedprogram2 });
})
	.then(() => {
		console.log('Done!');
	})
	.catch(err => {
		console.error(err);
	});
