import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import lint from './_lint.js';

describe('footnotes', () => {
	it('should support footnotes in list items', async () => {
		const messages = await lint({filename: 'test/fixtures/footnotes.md'});

		// Filter out non-footnote related errors
		const footnoteErrors = messages.filter(message => message.ruleId === 'no-undefined-references' && message.message.includes('footnote'));

		// Should have no footnote-related undefined reference errors
		assert.deepEqual(footnoteErrors, []);
	});
});
