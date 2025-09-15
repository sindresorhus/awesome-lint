import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import {remark} from 'remark';
import {readSync as readVFileSync} from 'to-vfile';
import gitRepoAgeRule from '../../rules/git-repo-age.js';

describe('rules › git-repo-age', () => {
	const config = {
		plugins: [
			remarkLint,
			gitRepoAgeRule,
		],
	};

	it('git-repo-age - should handle remote repo with repoURL', async () => {
		const file = readVFileSync('test/fixtures/list-item/0.md');
		file.repoURL = 'https://github.com/sindresorhus/awesome';

		const result = await remark().use(config).process(file);
		// Should not have git-repo-age errors for old repos like sindresorhus/awesome
		const gitRepoAgeErrors = result.messages.filter(message => message.ruleId === 'awesome-git-repo-age');
		assert.equal(gitRepoAgeErrors.length, 0);
	});

	it('git-repo-age - should skip check for remote repo', async () => {
		const file = readVFileSync('test/fixtures/list-item/0.md');
		// No repoURL set, will use local git which might work or fail depending on environment
		// This test just ensures the rule doesn't crash

		const result = await remark().use(config).process(file);
		// Should complete without throwing an error
		assert.ok(Array.isArray(result.messages));
	});
});
