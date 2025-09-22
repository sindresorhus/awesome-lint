import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import {remark} from 'remark';
import {readSync as readVFileSync} from 'to-vfile';
import gitRepoAgeRule, {formatRepositoryAgeMessage} from '../../rules/git-repo-age.js';

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

	it('git-repo-age - should skip check for local repo without errors', async () => {
		const file = readVFileSync('test/fixtures/list-item/0.md');
		// No repoURL set, will use local git which might work or fail depending on environment
		// This test just ensures the rule doesn't crash

		const result = await remark().use(config).process(file);
		// Should complete without throwing an error
		assert.ok(Array.isArray(result.messages));
	});

	it('formatRepositoryAgeMessage - should return undefined for repositories old enough', () => {
		const thirtyOneDaysInMilliseconds = 31 * 24 * 60 * 60 * 1000;
		const message = formatRepositoryAgeMessage(thirtyOneDaysInMilliseconds);
		assert.equal(message, undefined);
	});

	it('formatRepositoryAgeMessage - should return undefined for exactly 30 days old', () => {
		const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
		const message = formatRepositoryAgeMessage(thirtyDaysInMilliseconds);
		assert.equal(message, undefined);
	});

	it('formatRepositoryAgeMessage - should return message for repositories too young', () => {
		const fiveDaysInMilliseconds = 5 * 24 * 60 * 60 * 1000;
		const message = formatRepositoryAgeMessage(fiveDaysInMilliseconds);

		assert.ok(message.includes('Repository is 5 days old'));
		assert.ok(message.includes('must be at least 30 days old'));
		assert.ok(message.includes('25 days left'));
		assert.ok(message.includes('need time to mature'));
	});

	it('formatRepositoryAgeMessage - should use singular "day" when 1 day left', () => {
		const twentyNineDaysInMilliseconds = 29 * 24 * 60 * 60 * 1000;
		const message = formatRepositoryAgeMessage(twentyNineDaysInMilliseconds);

		assert.ok(message.includes('1 day left'));
		assert.ok(!message.includes('1 days left'));
	});

	it('formatRepositoryAgeMessage - should handle zero days old', () => {
		const message = formatRepositoryAgeMessage(0);

		assert.ok(message.includes('Repository is 0 days old'));
		assert.ok(message.includes('30 days left'));
	});
});
