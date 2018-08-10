'use strict';
const execa = require('execa');
const rule = require('unified-lint-rule');

const minGitRepoAgeDays = 30;
const minGitRepoAgeMs = minGitRepoAgeDays * 24 * 60 * 60 * 1000;

module.exports = rule('remark-lint:awesome/git-repo-age', async (ast, file) => {
	const {dirname} = file;

	try {
		const firstCommitHash = await execa.stdout('git', [
			'rev-list',
			'--max-parents=0',
			'HEAD'
		], {
			cwd: dirname
		});

		const firstCommitDate = await execa.stdout('git', [
			'show',
			'-s',
			'--format=%ci',
			firstCommitHash
		], {
			cwd: dirname
		});

		const date = new Date(firstCommitDate);
		const now = new Date();

		if (now - date < minGitRepoAgeMs) {
			file.message(`Git repository must be at least ${minGitRepoAgeDays} days old`);
		}
	} catch (err) {
		// Most likely not a git repository
		file.message(`Awesome list must reside in a valid git repository`);
	}
});

// For stubbing
module.exports.execa = execa;
