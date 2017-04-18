const cheerio = require('cheerio');
const parse = require('./parse.js');
const requests = require('../requests/requests');

module.exports.recent = () => {
	requests.get('https://deerfield.edu/athletics/events/recent-scores/')
	.then(({ data, }) => {
		parse.refreshEvents(cheerio.load(data))
		.then(() => {
			console.log('Refreshed all recent scores.');
		});
	});
};

module.exports.all = () => {
	const years = ['2012', '2013', '2014', '2015', '2016', ];
	years.forEach((year) => {
		requests.get(`https://deerfield.edu/athletics/events/${year}`)
		.then(({ data, }) => {
			parse.refreshEvents(cheerio.load(data))
			.then(() => {
				console.log(`Refreshed scores for ${year}.`);
			});
		});
	});
};
