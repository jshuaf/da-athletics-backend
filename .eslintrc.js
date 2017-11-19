module.exports = {
	parser:
		'babel-eslint',
	parserOptions: {
		ecmaVersion: 6,
		sourceType:
			'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	extends:
		'airbnb',
	rules: {
		indent: [
			'error',
			'tab',
		],
		'no-tabs': 0,
		'comma-dangle': [
			'error',
			{
				arrays:
					'always',
				objects:
					'always',
				imports:
					'always',
				exports:
					'always',
				functions:
					'never',
			},
		],
		'array-bracket-spacing': 0,
		'no-use-before-define': 0,
		'func-names': 0,
		'no-underscore-dangle': 0,
		'max-len': 0,
	},
	plugins: [
		'react',
	],
	env: {},
};
