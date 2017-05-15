const winston = require('winston');
const path = require('path');

winston.configure({
	transports: [
		new winston.transports.File({
			name: 'info',
			level: 'info',
			filename: path.join(__dirname, 'info.log'),
			json: true,
			maxsize: 5242880, // 5MB
			maxFiles: 5,
			colorize: false,
		}),
		new winston.transports.File({
			name: 'verbose',
			level: 'verbose',
			filename: path.join(__dirname, 'verbose.log'),
			json: true,
			maxsize: 5242880, // 5MB
			maxFiles: 5,
			colorize: false,
		}),
		new winston.transports.File({
			name: 'error',
			level: 'error',
			filename: path.join(__dirname, 'error.log'),
			handleExceptions: true,
			json: false,
			maxsize: 5242880, // 5MB
			maxFiles: 5,
			colorize: false,
		}),
		new winston.transports.Console({
			name: 'debug',
			level: 'debug',
			handleExceptions: true,
			json: false,
			colorize: true,
		}),
	],
	exitOnError: false,
});

winston.stream = {
	write(message) {
		winston.info(message);
	},
};
