const axios = require('axios');
const moment = require('moment');

axios
	.get('http://localhost:3000/events', {
		params: {
			startDate: moment('2017-01-18').toDate(),
			endDate: moment('2017-02-20').toDate(),
		},
	})
	.then(data => {
		console.log(data);
	})
	.catch(err => {
		console.log(err);
	});
