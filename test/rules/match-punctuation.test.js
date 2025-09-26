import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import lint from '../../index.js';

describe('match-punctuation', () => {
	it('should detect mismatched curly quotes', async () => {
		const markdown = `# Awesome Test [![Awesome](https://awesome.re/badge-flat.svg)](https://awesome.re)

> Test list.

## Contents

- [Section](#section)

## Section

- [Example](https://example.com) - Has unmatched "quote here.
`;

		const [vFile] = await lint({filename: 'readme.md', contents: markdown});
		const errors = vFile.messages.filter(m => m.ruleId === 'match-punctuation');

		// Should detect the mismatched curly quote
		assert.ok(errors.length > 0, 'Should detect mismatched curly quotes');

		// Verify it's detecting the curly quote specifically
		const hasQuoteError = errors.some(error => error.message.includes('"'));
		assert.ok(hasQuoteError, 'Should detect curly quote mismatch');
	});
});
