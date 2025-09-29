import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import headingRule from '../../rules/heading.js';

describe('rules › heading', () => {
	const config = {
		plugins: [
			remarkLint,
			headingRule,
		],
	};

	it('heading - missing', async () => {
		const messages = await lint({config, filename: 'test/fixtures/heading/error0.md'});
		assert.deepEqual(messages, [
			{
				line: 1,
				ruleId: 'awesome-heading',
				message: 'Missing main list heading',
			},
		]);
	});

	it('heading - not in title case', async () => {
		const messages = await lint({config, filename: 'test/fixtures/heading/error1.md'});
		assert.deepEqual(messages, [
			{
				line: 1,
				ruleId: 'awesome-heading',
				message: 'Main heading must be in title case',
			},
		]);
	});

	it('heading - more than one heading', async () => {
		const messages = await lint({config, filename: 'test/fixtures/heading/error2.md'});
		assert.deepEqual(messages, [
			{
				line: 3,
				ruleId: 'awesome-heading',
				message: 'List can only have one heading',
			},
		]);
	});

	it('heading - depth is bigger than 1', async () => {
		const messages = await lint({config, filename: 'test/fixtures/heading/error3.md'});
		assert.deepEqual(messages, [
			{
				line: 1,
				ruleId: 'awesome-heading',
				message: 'Main list heading must be of depth 1',
			},
		]);
	});

	it('heading - success', async () => {
		const messages = await lint({config, filename: 'test/fixtures/heading/success0.md'});
		assert.deepEqual(messages, []);
	});

	it('heading - success (with acronyms)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/heading/success1.md'});
		assert.deepEqual(messages, []);
	});

	it('heading - success (with .js extension - Node.js)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/heading/success2.md'});
		assert.deepEqual(messages, []);
	});

	it('heading - success (with HTML image heading)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/heading/success-html.md'});
		assert.deepEqual(messages, []);
	});

	it('heading - success (with h1 tag and image)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/heading/success-h1.md'});
		assert.deepEqual(messages, []);
	});
});
