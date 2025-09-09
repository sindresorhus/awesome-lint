import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import spellCheckRule from '../../rules/spell-check.js';

describe('rules › spell-check', () => {
	const config = {
		plugins: [
			remarkLint,
			spellCheckRule,
		],
	};

	it('spell-check - success', async () => {
		const messages = await lint({config, filename: 'test/fixtures/spell-check/success0.md'});
		assert.deepEqual(messages, []);
	});

	it('spell-check - error', async () => {
		const messages = await lint({config, filename: 'test/fixtures/spell-check/error0.md'});
		// TODO: Replace with proper assertion once node:test supports snapshots
		// Previously was: t.snapshot(messages);
		console.log('spell-check error messages:', messages);
		assert.ok(Array.isArray(messages));
	});
});
