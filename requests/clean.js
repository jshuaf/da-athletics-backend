const fs = require('fs');
const path = require('path');
const index = require('./index');

const valid = Object.keys(index).map(key => `${index[key]}.txt`);

fs.readdirSync(path.join(__dirname, 'raw')).forEach((file) => {
	if (valid.indexOf(file) < 0) {
		fs.unlink(path.join('raw', file));
	}
});
