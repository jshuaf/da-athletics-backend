const model = require('../model/model');
const refresh = require('../parse/refresh');
const co = require('co');

co(function*() {
	yield model.connect();
	console.log('Connected.');
	yield refresh.all(2018);
	console.log('2018 done.');
	yield refresh.all(2017);
	console.log('2017 done.');
	yield refresh.all(2016);
	console.log('2016 done.');
	yield refresh.all(2015);
	console.log('2015 done.');
	yield refresh.all(2014);
	console.log('2014 done.');
	yield refresh.all(2013);
	console.log('2013 done.');
	yield refresh.all(2012);
	console.log('2012 done.');
	console.log('Done refreshing all events from years 2012-2018!');
}).catch(error => {
	console.log(error);
});
