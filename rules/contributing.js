import fs from 'node:fs';
import path from 'node:path';
import {globbySync} from 'globby';
import {lintRule} from 'unified-lint-rule';

const contributingRule = lintRule('remark-lint:awesome-contributing', (ast, file) => {
	const {dirname} = file;

	const contributingFile = globbySync(['contributing.md', '.github/contributing.md'], {caseSensitiveMatch: false, cwd: dirname})[0];
	// TODO: This doesn't work on Linux for some reason. Investigate and then open an issue on `fast-glob`.
	// const contributingFile = globby.sync('contributing.md', {case: false, cwd: dirname})[0];

	if (!contributingFile) {
		file.message('Missing file contributing.md');
		return;
	}

	const contributingPath = path.resolve(dirname, contributingFile);
	const contributing = fs.readFileSync(contributingPath, 'utf8').trim();

	if (!contributing) {
		file.message('contributing.md file must not be empty');
	}
});

export default contributingRule;
