'use strict';
const fs = require('fs');
const path = require('path');
const globby = require('globby');
const rule = require('unified-lint-rule');

module.exports = rule('awesome-lint:awesome/contributing', (ast, file) => {
	const {dirname} = file;

	const contributingFile = globby.sync('contributing.md', {nocase: true, cwd: dirname})[0];

	if (!contributingFile) {
		file.message('Missing file contributing.md', ast);
		return;
	}

	const contributingPath = path.resolve(dirname, contributingFile);
	const contributing = fs.readFileSync(contributingPath, 'utf8').trim();

	if (!contributing) {
		file.message('contributing.md file must not be empty', ast);
	}
});
