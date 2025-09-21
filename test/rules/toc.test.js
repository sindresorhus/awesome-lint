import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import tocPlugin from '../../rules/toc.js';

describe('rules › toc', () => {
	const config = {
		plugins: [
			remarkLint,
			tocPlugin,
		],
	};

	it('toc - success basic', async () => {
		const messages = await lint({config, filename: 'test/fixtures/toc/0.md'});
		assert.deepEqual(messages, []);
	});

	it('toc - success sub-lists', async () => {
		const messages = await lint({config, filename: 'test/fixtures/toc/1.md'});
		assert.deepEqual(messages, []);
	});

	it('toc - optional (no ToC present)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/list-item/5.md'});
		assert.deepEqual(messages, []);
	});

	it('toc - invalid heading text (not "Contents")', async () => {
		const messages = await lint({config, filename: 'test/fixtures/toc/2.md'});
		// Should pass without errors now since ToC is optional
		assert.deepEqual(messages, []);
	});

	it('toc - missing items', async () => {
		const messages = await lint({config, filename: 'test/fixtures/toc/3.md'});
		assert.deepEqual(messages, [
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

	it('toc - exceed max depth', async () => {
		const messages = await lint({config, filename: 'test/fixtures/toc/4.md'});
		assert.deepEqual(messages, [
			{
				line: 1,
				ruleId: 'awesome-toc',
				message: 'Exceeded max depth of 2 levels',
			},
		]);
	});

	it('toc - success ignore contributing section', async () => {
		const messages = await lint({config, filename: 'test/fixtures/toc/5.md'});
		assert.deepEqual(messages, []);
	});

	it('toc - success html intro', async () => {
		const messages = await lint({config, filename: 'test/fixtures/toc/6.md'});
		assert.deepEqual(messages, []);
	});

	it('toc - success ignore footnote subsections', async () => {
		const messages = await lint({config, filename: 'test/fixtures/toc/7.md'});
		assert.deepEqual(messages, []);
	});

	it('toc - success ignore contributing and footnote subsections', async () => {
		const messages = await lint({config, filename: 'test/fixtures/toc/8.md'});
		assert.deepEqual(messages, []);
	});

	it('toc - success ignore related lists section', async () => {
		const messages = await lint({config, filename: 'test/fixtures/toc/9.md'});
		assert.deepEqual(messages, []);
	});

	it('toc - success ignore related lists subsections', async () => {
		const messages = await lint({config, filename: 'test/fixtures/toc/10.md'});
		assert.deepEqual(messages, []);
	});

	it('toc - success with emoji variation selectors', async () => {
		const messages = await lint({config, filename: 'test/fixtures/toc/emoji-variation-selectors.md'});
		assert.deepEqual(messages, []);
	});
});
