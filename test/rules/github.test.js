import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import {remark} from 'remark';
import {readSync as readVFileSync} from 'to-vfile';
import githubRule from '../../rules/github.js';

describe('rules › github', () => {
	const config = {
		plugins: [
			remarkLint,
			githubRule,
		],
	};

	it('github - should handle remote repo with repoURL', async () => {
		const file = readVFileSync('test/fixtures/list-item/0.md');
		file.repoURL = 'https://github.com/sindresorhus/awesome';

		const result = await remark().use(config).process(file);
		// Should check GitHub repo properties via API
		const githubErrors = result.messages.filter(message => message.ruleId === 'awesome-github');
		// May have errors about topics or description, but shouldn't have "not a git repository" error
		const gitRepoErrors = githubErrors.filter(message => message.message.includes('git repository'));
		assert.equal(gitRepoErrors.length, 0);
	});

	it('github - should handle local repo', async () => {
		const file = readVFileSync('test/fixtures/list-item/0.md');
		// No repoURL set, will use local git which might work or fail depending on environment
		// This test just ensures the rule doesn't crash

		const result = await remark().use(config).process(file);
		// Should complete without throwing an error
		assert.ok(Array.isArray(result.messages));
	});

	it('github - should reject non-GitHub URL', async () => {
		const file = readVFileSync('test/fixtures/list-item/0.md');
		file.repoURL = 'https://gitlab.com/example/repo';

		const result = await remark().use(config).process(file);
		// Should have error about GitHub requirement
		const githubErrors = result.messages.filter(message => message.ruleId === 'awesome-github');
		assert.ok(githubErrors.length > 0);
		assert.ok(githubErrors[0].message.includes('GitHub'));
	});
});
