const mongoose = require('mongoose');
const Team = require('./Team');
const Event = require('./Event');
const Program = require('./Program');
const Device = require('./Device');

mongoose.Promise = global.Promise;

exports.connect = () => mongoose.connect('mongodb://localhost:27017/da-athletics');

exports.addEvent = data => (new Event(data)).save();

exports.findEvent = data => Event.findOne(data).exec();

exports.findEventsByDate = ((start, end) =>
	Event.find({ date: { $lte: end, $gte: start, }, }).lean().exec()
);

exports.findEventsByTeam = (teamID =>
	Event.find({ team: teamID, }).lean().exec());

exports.updateEvent = (id, toUpdate) =>
	Event.findByIdAndUpdate(id, toUpdate, { new: true, }).exec();

exports.addTeam = data => (new Team(data)).save();

exports.findTeam = data => Team.findOne(data).exec();

exports.findOrAddTeam = data =>
	exports.findTeam(data).then(event => event || exports.addTeam(data));

exports.findAllTeams = () => Team.find().lean().exec();

exports.updateTeam = (id, toUpdate) =>
	Team.findByIdAndUpdate(id, toUpdate, { new: true, }).exec();

exports.findProgram = data => Program.findOne(data).exec();

exports.findAllPrograms = () => Program.find().lean().exec();

exports.addProgram = data => (new Program(data)).save();

exports.updateProgram = (id, toUpdate) =>
	Program.findByIdAndUpdate(id, toUpdate, { new: true, }).exec();

exports.removeAllEvents = () => Event.remove({});

exports.addDevice = data => (new Device(data)).save();

exports.findDevice = data => Device.findOne({ _id: data._id, }).exec();

exports.updateDevice = (id, toUpdate) =>
	Device.findByIdAndUpdate(id, toUpdate, { new: true, upsert: true, }).exec();

exports.findAllDevices = () => Device.find().exec();

exports.closeDatabase = () => mongoose.connection.close();
