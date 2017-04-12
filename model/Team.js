const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const TeamSchema = Schema({
	level: { type: String, required: true, },
	program: { type: Schema.Types.ObjectId, ref: 'Program', required: true, },
	url: { type: String, unique: true, },
	events: [{ type: Number, ref: 'Event', }, ],
});

TeamSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Team', TeamSchema);
