const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const DeviceSchema = Schema({
	_id: { type: String, required: true, unique: true },
	position: { type: String, required: true },
	primaryTeam: { type: Schema.Types.ObjectId, ref: 'Team' },
	teamsWithNotifications: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
});

DeviceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Device', DeviceSchema);
