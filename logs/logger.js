const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

winston.configure({
	transports: [
		new winston.transports.DailyRotateFile({
			name: 'info',
			level: 'info',
			filename: path.join(__dirname, 'info-%DATE%.log'),
			json: true,
			maxsize: '20m',
			maxFiles: '14d',
			colorize: false,
		}),
		new winston.transports.DailyRotateFile({
			name: 'verbose',
			level: 'verbose',
			filename: path.join(__dirname, 'verbose-%DATE%.log'),
			json: true,
			maxsize: '20m',
			maxFiles: '14d',
			colorize: false,
		}),
		new winston.transports.DailyRotateFile({
			name: 'error',
			level: 'error',
			filename: path.join(__dirname, 'error-%DATE%.log'),
			handleExceptions: true,
			json: false,
			maxsize: '20m',
			maxFiles: '14d',
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
