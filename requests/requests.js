const axios = require('axios');
const fs = require('fs');
const co = require('co');
const path = require('path');

const tools = require('../tools');
require('./clean');

exports.get = (url, options = {}) => {
	const index = JSON.parse(fs.readFileSync(path.join(__dirname, 'index.json')));
	if (
		options.update ||
		!index[url] ||
		!fs.existsSync(path.join(__dirname, 'raw', `./${index[url]}.txt`))
	) {
		return co(function* () {
			const response = yield axios.get(url);
			const key = tools.random();
			index[url] = key;
			fs.writeFileSync(
				path.join(__dirname, 'index.json'),
				JSON.stringify(index)
			);
			fs.writeFileSync(
				path.join(__dirname, 'raw', `${key}.txt`),
				response.data
			);
			return response;
		});
	}
	const data = fs.readFileSync(
		path.join(__dirname, 'raw', `./${index[url]}.txt`)
	);
	return Promise.resolve({
		data,
	});
};
