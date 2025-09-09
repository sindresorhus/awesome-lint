import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import noCiBadgeRule from '../../rules/no-ci-badge.js';

describe('rules › no-ci-badge', () => {
	const config = {
		plugins: [
			remarkLint,
			noCiBadgeRule,
		],
	};

	it('no-ci-badge - missing', async () => {
		const messages = await lint({config, filename: 'test/fixtures/no-ci-badge/0.md'});
		assert.deepEqual(messages, [
			{
				line: 1,
				ruleId: 'awesome-no-ci-badge',
				message: 'Readme must not contain CI badge',
			},
			{
				line: 3,
				ruleId: 'awesome-no-ci-badge',
				message: 'Readme must not contain CI badge',
			},
		]);
	});
});
