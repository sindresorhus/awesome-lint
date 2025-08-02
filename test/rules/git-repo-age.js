import {test, expect} from 'vitest';
import esmock from 'esmock';
import lint from '../_lint.js';

const filename = 'test/fixtures/git-repo-age/0.md';

test.fails('git-repo-age - error invalid git repo', async () => {
	const gitRepoAge = await esmock('../../rules/git-repo-age.js', {
		execa: {
			stdout() {
				throw new Error('"git" command not found');
			},
		},
	});

	const config = {plugins: [gitRepoAge]};
	const messages = await lint({config, filename});

	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-git-repo-age',
			message:
        'Awesome list must reside in a valid deep-cloned Git repository (see https://github.com/sindresorhus/awesome-lint#tip for more information)',
		},
	]);
});

test.fails('git-repo-age - error repo is not old enough', async () => {
	const gitRepoAge = await esmock('../../rules/git-repo-age.js', {
		execa: {
			stdout(cmd, args) {
				if (args.includes('--max-parents=0')) {
					return '14fc116c8ff54fc8a13c4a3b7527eb95fb87d400';
				}

				if (args.includes('--format=%ci')) {
					return '2030-08-01 12:55:53 +0200';
				}

				return '';
			},
		},
	});

	const config = {plugins: [gitRepoAge]};
	const messages = await lint({config, filename});

	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-git-repo-age',
			message: 'Git repository must be at least 30 days old',
		},
	]);
});

test.fails('git-repo-age - valid repo is old enough', async () => {
	const gitRepoAge = await esmock('../../rules/git-repo-age.js', {
		execa: {
			stdout(cmd, args) {
				if (args.includes('--max-parents=0')) {
					return '14fc116c8ff54fc8a13c4a3b7527eb95fb87d400';
				}

				if (args.includes('--format=%ci')) {
					return '2016-08-01 12:55:53 +0200';
				}

				return '';
			},
		},
	});

	const config = {plugins: [gitRepoAge]};
	const messages = await lint({config, filename});

	expect(messages).toEqual([]);
});
