const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const EventSchema = Schema({
	_id: { type: Number, required: true, unique: true, },
	date: { type: Date, required: true, },
	team: { type: Schema.Types.ObjectId, ref: 'Team', },
	opponent: { type: String, required: true, },
	location: { type: String, required: true, },
	score1: { type: Number, },
	score2: { type: Number, },
	descriptionURL: { type: String, },
	status: { type: String, enum: ['Win', 'Loss', 'Tie', 'Cancelled', 'Scrimmage', 'Other', ], required: true, },
});

EventSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Event', EventSchema);
