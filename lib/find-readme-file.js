'use strict';

const fs = require('fs');
const path = require('path');

const readmeFilenames = [
	'README',
	'README.markdown',
	'README.md',
	'README.txt',
	'Readme.md',
	'readme.markdown',
	'readme.md',
	'readme.txt'
];

module.exports = dir => {
	const readmeFile = fs.readdirSync(dir).find(filename => (
		readmeFilenames.indexOf(filename) >= 0
	));

	if (readmeFile) {
		return path.join(fs.realpathSync(dir), readmeFile);
	}
};
