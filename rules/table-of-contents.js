'use strict';
const visit = require('unist-util-visit');
const chalk = require('chalk');

module.exports = (ast, file, language, done) => {
	visit(ast, 'heading', (node, index) => {
		const title = node.children[0].value;

		if (index === 1 && title !== 'Contents') {
			file.warn(`The first section must be ${chalk.bold('Contents')}`);
			return false;
		}
	});
	done();
};
