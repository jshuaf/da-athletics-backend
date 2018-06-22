const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const RosterSchema = Schema({
	players: [
		{
			name: { type: String, required: true },
			number: { type: String },
			class: { type: String },
			position: { type: String },
			hometown: { type: String },
			captain: { type: Boolean, required: true },
			manager: { type: Boolean, required: true },
		},
	],
	team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
	season: { type: Date, required: true },
});

module.exports = mongoose.model('Roster', RosterSchema);
