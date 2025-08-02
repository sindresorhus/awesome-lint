import {test, expect} from 'vitest';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import badgeRule from '../../rules/badge.js';

const config = {
	plugins: [
		remarkLint,
		badgeRule,
	],
};

test('badge - missing', async () => {
	const messages = await lint({config, filename: 'test/fixtures/badge/error0.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-badge',
			message: 'Missing Awesome badge after the main heading',
		},
	]);
});

test('badge - incorrect source', async () => {
	const messages = await lint({config, filename: 'test/fixtures/badge/error1.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-badge',
			message: 'Invalid badge source',
		},
	]);
});

test('badge - incorrect source raw git', async () => {
	const messages = await lint({config, filename: 'test/fixtures/badge/error2.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-badge',
			message: 'Invalid badge source',
		},
	]);
});

test('badge - success (short)', async () => {
	const messages = await lint({config, filename: 'test/fixtures/badge/success0.md'});
	expect(messages).toEqual([]);
});

test('badge - success (long)', async () => {
	const messages = await lint({config, filename: 'test/fixtures/badge/success1.md'});
	expect(messages).toEqual([]);
});

test('badge - success (new badge)', async () => {
	const messages = await lint({config, filename: 'test/fixtures/badge/success2.md'});
	expect(messages).toEqual([]);
});
