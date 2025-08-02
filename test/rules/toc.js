import {test, expect} from 'vitest';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import tocPlugin from '../../rules/toc.js';

const config = {
	plugins: [remarkLint, tocPlugin],
};

test('toc - success basic', async () => {
	const messages = await lint({config, filename: 'test/fixtures/toc/0.md'});
	expect(messages).toEqual([]);
});

test('toc - success sub-lists', async () => {
	const messages = await lint({config, filename: 'test/fixtures/toc/1.md'});
	expect(messages).toEqual([]);
});

test('toc - missing', async () => {
	const messages = await lint({config, filename: 'test/fixtures/toc/2.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-toc',
			message: 'Missing or invalid Table of Contents',
		},
	]);
});

test('toc - missing items', async () => {
	const messages = await lint({config, filename: 'test/fixtures/toc/3.md'});
	expect(messages).toEqual([
		{
			line: 6,
			ruleId: 'awesome-toc',
			message: 'ToC missing item for "Foo B"',
		},
		{
			line: 8,
			ruleId: 'awesome-toc',
			message: 'ToC item "Bar" does not match corresponding heading "Bar A"',
		},
		{
			line: 5,
			ruleId: 'awesome-toc',
			message: 'ToC missing item for "Baz"',
		},
	]);
});

test('toc - exceed max depth', async () => {
	const messages = await lint({config, filename: 'test/fixtures/toc/4.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-toc',
			message: 'Exceeded max depth of 2 levels',
		},
	]);
});

test('toc - success ignore contributing section', async () => {
	const messages = await lint({config, filename: 'test/fixtures/toc/5.md'});
	expect(messages).toEqual([]);
});

test('toc - success html intro', async () => {
	const messages = await lint({config, filename: 'test/fixtures/toc/6.md'});
	expect(messages).toEqual([]);
});
