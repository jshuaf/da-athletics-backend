module.exports = {
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	extends: ['airbnb', 'prettier', 'prettier/react'],
	rules: {
		'no-tabs': 0,
		'array-bracket-spacing': 0,
		'no-use-before-define': 0,
		'func-names': 0,
		'no-underscore-dangle': 0,
		'max-len': 0,
		'no-param-reassign': 0,
	},
	plugins: ['react'],
	env: {},
};
