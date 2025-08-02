import {test, expect} from 'vitest';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import headingRule from '../../rules/heading.js';

const config = {
	plugins: [remarkLint, headingRule],
};

test('heading - missing', async () => {
	const messages = await lint({config, filename: 'test/fixtures/heading/error0.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-heading',
			message: 'Missing main list heading',
		},
	]);
});

test('heading - not in title case', async () => {
	const messages = await lint({config, filename: 'test/fixtures/heading/error1.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-heading',
			message: 'Main heading must be in title case',
		},
	]);
});

test('heading - more than one heading', async () => {
	const messages = await lint({config, filename: 'test/fixtures/heading/error2.md'});
	expect(messages).toEqual([
		{
			line: 3,
			ruleId: 'awesome-heading',
			message: 'List can only have one heading',
		},
	]);
});

test('heading - depth is bigger than 1', async () => {
	const messages = await lint({config, filename: 'test/fixtures/heading/error3.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-heading',
			message: 'Main list heading must be of depth 1',
		},
	]);
});

test('heading - success', async () => {
	const messages = await lint({config, filename: 'test/fixtures/heading/success0.md'});
	expect(messages).toEqual([]);
});

test('heading - success (with acronyms)', async () => {
	const messages = await lint({config, filename: 'test/fixtures/heading/success1.md'});
	expect(messages).toEqual([]);
});
