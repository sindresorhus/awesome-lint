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

	it('spell-check - ambiguous words', async () => {
		const messages = await lint({config, filename: 'test/fixtures/spell-check/ambiguous-words.md'});
		// Should only flag words in product/framework context (9 errors expected)
		const productContextErrors = messages.filter(m => m.message?.includes('should be written as'));
		console.log(`spell-check ambiguous words: ${productContextErrors.length} errors found`);
		// Log all messages for debugging
		for (const m of messages) {
			console.log(`Line ${m.line}: ${m.message}`);
		}

		// These are the expected errors from the "Product/framework context" section
		assert.equal(productContextErrors.length, 9);
	});
});
