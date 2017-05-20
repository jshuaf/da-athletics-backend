const Event = require('../model/Event');
const moment = require('moment');

const start = moment().subtract(2, 'd');
const end = moment().add(1, 'd');
const model = require('../model/model');

const eventQuery = Event.find({ date: { $lte: end, $gte: start, }, }).exec();
model.connect().then(eventQuery).then(events => events.forEach((event) => {
	event.status = 'Unscored';
	event.save();
}));
