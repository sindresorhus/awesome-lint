import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import badgeRule from '../../rules/badge.js';

describe('rules › badge', () => {
	const config = {
		plugins: [
			remarkLint,
			badgeRule,
		],
	};

	it('badge - missing', async () => {
		const messages = await lint({config, filename: 'test/fixtures/badge/error0.md'});
		assert.deepEqual(messages, [
			{
				line: 1,
				ruleId: 'awesome-badge',
				message: 'Missing Awesome badge next to the main heading',
			},
		]);
	});

	it('badge - incorrect source', async () => {
		const messages = await lint({config, filename: 'test/fixtures/badge/error1.md'});
		assert.deepEqual(messages, [
			{
				line: 1,
				ruleId: 'awesome-badge',
				message: 'Invalid badge source',
			},
		]);
	});

	it('badge - incorrect source raw git', async () => {
		const messages = await lint({config, filename: 'test/fixtures/badge/error2.md'});
		assert.deepEqual(messages, [
			{
				line: 1,
				ruleId: 'awesome-badge',
				message: 'Invalid badge source',
			},
		]);
	});

	it('badge - success (short)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/badge/success0.md'});
		assert.deepEqual(messages, []);
	});

	it('badge - success (long)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/badge/success1.md'});
		assert.deepEqual(messages, []);
	});

	it('badge - success (new badge)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/badge/success2.md'});
		assert.deepEqual(messages, []);
	});
});
