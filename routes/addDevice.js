const Joi = require('joi');
const winston = require('winston');
const model = require('../model/model');
const co = require('co');
const Promise = require('bluebird');

const addDeviceSchema = {
	_id: Joi.string(),
	position: Joi.string(),
	primaryTeam: Joi.string().optional(),
	teamsWithNotifications: Joi.string().optional(),
};

module.exports = (req, res) => {
	const { error } = Joi.validate(req.body, addDeviceSchema, {
		presence: 'required',
	});
	if (error) {
		winston.error(error);
		return res.status(400).end();
	}
	const deviceData = Object.assign(req.body);
	return Promise.resolve()
		.then(() => {
			if (deviceData.teamsWithNotifications) {
				deviceData.teamsWithNotifications = JSON.parse(
					deviceData.teamsWithNotifications,
				);
				if (deviceData.teamsWithNotifications.length > 0) {
					return Promise.map(deviceData.teamsWithNotifications, teamID =>
						co(function*() {
							const team = yield model.findTeam({ _id: teamID });
							if (team.devicesWithNotifications.indexOf(deviceData._id) < 0) {
								team.devicesWithNotifications.push(deviceData._id);
							}
							yield team.save();
						}),
					);
				}
			}
			return {};
		})
		.then(() => model.findDevice({ _id: deviceData._id }))
		.then(
			oldDevice =>
				!oldDevice ||
				Promise.map(oldDevice.teamsWithNotifications, teamID => {
					co(function*() {
						if (
							deviceData.teamsWithNotifications.indexOf(teamID.toString()) < 0
						) {
							const team = yield model.findTeam({ _id: teamID });
							const index = team.devicesWithNotifications.indexOf(
								deviceData._id,
							);
							if (index >= 0) {
								team.devicesWithNotifications.splice(index, 1);
							}
							yield team.save();
						}
					});
				}),
		)
		.then(() => {
			model.updateDevice(deviceData._id, deviceData);
		})
		.then(() => {
			res.status(200).end();
		})
		.catch(err => {
			winston.error('Error when responding to device add request.', err);
			return res.status(400).end();
		});
};
