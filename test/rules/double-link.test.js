import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import doubleLinkRule, {createAwesomeListIgnore} from '../../rules/double-link.js';

describe('rules › double-link', () => {
	const config = {
		plugins: [
			remarkLint,
			doubleLinkRule,
		],
	};

	it('duplicate links', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/duplicate.md'});
		assert.deepEqual(messages, [
			{
				line: 2,
				ruleId: 'double-link',
				message: 'Duplicate link: https://example.com',
			},
			{
				line: 3,
				ruleId: 'double-link',
				message: 'Duplicate link: https://example.com',
			},
		]);
	});

	it('unique links with different hashes', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/unique-hashes.md'});
		assert.deepEqual(messages, []);
	});

	it('duplicate links with same hash', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/duplicate-with-hash.md'});
		assert.deepEqual(messages, [
			{
				line: 2,
				ruleId: 'double-link',
				message: 'Duplicate link: https://playground.babylonjs.com/#58I88I#186',
			},
			{
				line: 3,
				ruleId: 'double-link',
				message: 'Duplicate link: https://playground.babylonjs.com/#58I88I#186',
			},
		]);
	});

	it('no duplicates', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/no-duplicates.md'});
		assert.deepEqual(messages, []);
	});

	it('duplicate anchor links', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/duplicate-anchors.md'});
		assert.deepEqual(messages, [
			{
				line: 2,
				ruleId: 'double-link',
				message: 'Duplicate link: #section',
			},
			{
				line: 3,
				ruleId: 'double-link',
				message: 'Duplicate link: #section',
			},
		]);
	});

	it('edge cases', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/edge-cases.md'});
		assert.deepEqual(messages, [
			{
				line: 2,
				ruleId: 'double-link',
				message: 'Duplicate link: javascript:void(0)',
			},
			{
				line: 3,
				ruleId: 'double-link',
				message: 'Duplicate link: javascript:void(0)',
			},
			{
				line: 4,
				ruleId: 'double-link',
				message: 'Duplicate link: ',
			},
			{
				line: 5,
				ruleId: 'double-link',
				message: 'Duplicate link: ',
			},
		]);
	});

	it('normalized duplicates', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/normalized-duplicates.md'});
		assert.deepEqual(messages, [
			{
				line: 2,
				ruleId: 'double-link',
				message: 'Duplicate link: https://example.com/',
			},
			{
				line: 3,
				ruleId: 'double-link',
				message: 'Duplicate link: https://example.com',
			},
			{
				line: 4,
				ruleId: 'double-link',
				message: 'Duplicate link: http://example.com/',
			},
		]);
	});

	it('project website URL ignored', async () => {
		// Test that a project website URL can appear multiple times when configured with ignore
		const configWithWebsiteIgnore = {
			plugins: [
				remarkLint,
				[doubleLinkRule, {ignore: ['https://project-website.com']}],
			],
		};

		const messages = await lint({
			config: configWithWebsiteIgnore,
			filename: 'test/fixtures/double-link/repo-url-ignored.md',
		});

		// Should not report duplicates for the project website URL
		assert.ok(!messages.some(message =>
			message.ruleId === 'double-link'
			&& message.message.includes('project-website.com')));

		// Should have no duplicate errors since project website URL is ignored
		assert.deepEqual(messages, []);
	});

	it('custom ignore list', async () => {
		// Test that custom URLs can be ignored via options
		const configWithIgnore = {
			plugins: [
				remarkLint,
				[doubleLinkRule, {ignore: ['https://example.com/tool']}],
			],
		};

		const messages = await lint({config: configWithIgnore, filename: 'test/fixtures/double-link/duplicate.md'});

		// The example.com links in duplicate.md should still be flagged
		// since they don't match our ignore pattern exactly
		assert.ok(messages.some(message => message.ruleId === 'double-link'));
	});

	it('integration with lint function and repoURL', async () => {
		// Mock the GitHub API to return a homepage
		const originalFetch = globalThis.fetch;
		globalThis.fetch = async url => {
			if (url.includes('api.github.com')) {
				return {
					ok: true,
					json: async () => ({
						homepage: 'https://project-website.com',
						description: 'Test repository',
						license: {key: 'mit'},
						topics: ['awesome', 'awesome-list'],
					}),
				};
			}

			return originalFetch(url);
		};

		try {
			// Test that using lint() with repoURL automatically ignores project website
			const messages = await lint({
				filename: 'test/fixtures/double-link/repo-url-ignored.md',
				repoURL: 'https://github.com/test/repo',
			});

			// Filter to only double-link messages
			const doubleLinkMessages = messages.filter(message => message.ruleId === 'double-link');

			// Should not report duplicates for the project website URL
			assert.ok(!doubleLinkMessages.some(message =>
				message.message.includes('project-website.com')));
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('links in descriptions are not counted as duplicates with awesome-list behavior', async () => {
		// Test that links appearing in list item descriptions are not flagged as duplicates when using awesome-list behavior
		const configWithAwesomeList = {
			plugins: [
				remarkLint,
				[doubleLinkRule, {shouldIgnore: createAwesomeListIgnore}],
			],
		};

		const messages = await lint({config: configWithAwesomeList, filename: 'test/fixtures/double-link/links-in-descriptions.md'});

		// Should not report any duplicate link errors for unicorn links that appear in descriptions
		assert.deepEqual(messages, []);
	});

	it('general behavior - all links checked when no shouldIgnore provided', async () => {
		// Test that without shouldIgnore, all duplicate links are flagged (general behavior)
		const configGeneral = {
			plugins: [
				remarkLint,
				doubleLinkRule, // No options = general behavior
			],
		};

		const messages = await lint({
			config: configGeneral,
			filename: 'test/fixtures/double-link/links-in-descriptions.md',
		});

		// Should report duplicate link errors for unicorn links that appear in descriptions
		assert.deepEqual(messages, [
			{
				line: 3,
				ruleId: 'double-link',
				message: 'Duplicate link: https://github.com/sindresorhus/unicorn',
			},
			{
				line: 4,
				ruleId: 'double-link',
				message: 'Duplicate link: https://github.com/sindresorhus/unicorn',
			},
		]);
	});

	it('custom shouldIgnore factory function works', async () => {
		// Test that a custom shouldIgnore factory function works
		const configWithCustomIgnore = {
			plugins: [
				remarkLint,
				[doubleLinkRule, {
					shouldIgnore: _ast => node =>
						// Ignore links to sindresorhus/unicorn
						node.url && node.url.includes('sindresorhus/unicorn'),
				}],
			],
		};

		const messages = await lint({
			config: configWithCustomIgnore,
			filename: 'test/fixtures/double-link/links-in-descriptions.md',
		});

		// Should not report any duplicates since all sindresorhus/unicorn links are ignored
		assert.deepEqual(messages, []);
	});
});
