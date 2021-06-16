'use strict';

const fs = require('fs');
const path = require('path');

module.exports = directory => {
	const readmeFile = fs.readdirSync(directory).find(filename => (
		/readme|readme\.md|readme\.markdown|readme.txt/i.test(filename)
	));

	if (readmeFile) {
		return path.join(fs.realpathSync(directory), readmeFile);
	}
};
