const notify = require('./notify');
const model = require('../model/model');
const apn = require('apn');

const provider = new apn.Provider({
	token: {
		key: '../APNsAuthKey_YMB3K93PU3.p8',
		keyId: 'YMB3K93PU3',
		teamId: 'RPE83CLFGM',
	},
	production: false,
});

const notification = new apn.Notification();

notification.alert = 'HI';
notification.badge = 1;
notification.payload.event = 10244690;

model.connect().then(() => { notify.sendNotification(provider, notification); });
