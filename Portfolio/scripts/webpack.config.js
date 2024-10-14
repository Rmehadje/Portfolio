const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'production',
	entry: './scripts/script.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, '../dist'),
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.GITHUBTOKEN': JSON.stringify(process.env.GITHUBTOKEN),
			'process.env.SERVICEID': JSON.stringify(process.env.SERVICEID),
			'process.env.APIKEY': JSON.stringify(process.env.APIKEY),
			'process.env.TEMPLATEID': JSON.stringify(process.env.TEMPLATEID),
		}),
	],
};