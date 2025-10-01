import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import lint from '../../index.js';

describe('apostrophe handling', () => {
	it('should not flag apostrophes as unmatched quotes', async () => {
		const markdown = `# Awesome Test [![Awesome](https://awesome.re/badge-flat.svg)](https://awesome.re)

> Test list.

## Contents

- [Section](#section)

## Section

- [Example](https://example.com) - This doesn't trigger false positives.
- [Another](https://example.com) - It isn't, can't, won't cause issues.
`;

		const [vFile] = await lint({filename: 'readme.md', contents: markdown});

		const apostropheErrors = vFile.messages.filter(message => message.ruleId === 'balanced-punctuation' && message.message.includes('\''));

		assert.equal(apostropheErrors.length, 0);
	});
});
