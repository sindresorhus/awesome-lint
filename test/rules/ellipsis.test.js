import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import noRepeatPunctuation from 'remark-lint-no-repeat-punctuation';
import lint from '../_lint.js';

const config = {
	plugins: [
		remarkLint,
		[noRepeatPunctuation, '！!~～,，·?？'], // Exclude dots to allow ellipsis (...)
	],
};

describe('rules › ellipsis', () => {
	it('should not flag ellipsis as repeated punctuation', async () => {
		const messages = await lint({config, filename: 'test/fixtures/ellipsis.md'});
		// Should not have any repeated punctuation errors for ellipsis
		const repeatPunctuationErrors = messages.filter(message => message.ruleId === 'no-repeat-punctuation');
		assert.equal(repeatPunctuationErrors.length, 0);
	});
});
