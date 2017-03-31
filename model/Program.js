const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const ProgramSchema = Schema({
	teams: [{ type: Schema.Types.ObjectId, ref: 'Team', }, ],
	name: { type: String, unique: true, required: true, },
	url: { type: String, unique: true, required: true, },
});

ProgramSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Program', ProgramSchema);
