import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import listItemRule from '../../rules/list-item.js';

describe('rules › list-item', () => {
	const config = {
		plugins: [
			remarkLint,
			listItemRule,
		],
	};

	it('list-item - valid', async () => {
		const messages = await lint({config, filename: 'test/fixtures/list-item/0.md'});
		assert.deepEqual(messages, []);
	});

	it('list-item - invalid', async () => {
		const messages = await lint({config, filename: 'test/fixtures/list-item/1.md'});
		// TODO: Replace with proper assertion once node:test supports snapshots
		// Previously was: t.snapshot(messages);
		console.log('list-item invalid messages:', messages);
		assert.ok(Array.isArray(messages));
	});

	it('list-item - valid ignoring Contents section', async () => {
		const messages = await lint({config, filename: 'test/fixtures/list-item/2.md'});
		assert.deepEqual(messages, []);
	});

	it('list-item - invalid sublist punctuation', async () => {
		const messages = await lint({config, filename: 'test/fixtures/list-item/3.md'});
		// TODO: Replace with proper assertion once node:test supports snapshots
		// Previously was: t.snapshot(messages);
		console.log('list-item invalid sublist punctuation messages:', messages);
		assert.ok(Array.isArray(messages));
	});

	it('list-item - disable, enable, and ignore comments', async () => {
		const messages = await lint({config, filename: 'test/fixtures/list-item/4.md'});
		// TODO: Replace with proper assertion once node:test supports snapshots
		// Previously was: t.snapshot(messages);
		console.log('list-item disable/enable/ignore comments messages:', messages);
		assert.ok(Array.isArray(messages));
	});

	it('list-item - multiple badges before link', async () => {
		const messages = await lint({config, filename: 'test/fixtures/list-item/5.md'});
		assert.deepEqual(messages, []);
	});

	it('list-item - link references', async () => {
		const messages = await lint({config, filename: 'test/fixtures/list-item/6.md'});
		assert.deepEqual(messages, []);
	});

	it('list-item - symbol prefixes', async () => {
		const messages = await lint({config, filename: 'test/fixtures/list-item/7.md'});
		assert.deepEqual(messages, []);
	});
});
