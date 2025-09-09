import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import lint from '../index.js';
import findReadmeFile from '../lib/find-readme-file.js';

/**
Verify there are no `VMessages` in the `VFile`, except for certain rule IDs.

@param {VFile} vFile - `VFile` with a list of messages.
@param {string[]} expectedRuleIds - Rule IDs for messages you expect to see.
*/
function noUnwantedVMessages(vFile, expectedRuleIds) {
	const seenRules = new Set(vFile.messages.map(vMessage => vMessage.ruleId));

	assert.deepEqual([...seenRules], expectedRuleIds, vFile.messages.join('\n'));
}

describe('integration', () => {
	it('awesome', async () => {
		const [readme, codeOfConduct] = await lint({filename: findReadmeFile('test/canonical/awesome')});

		noUnwantedVMessages(readme, [
			'match-punctuation',
			'awesome-heading',
			'awesome-spell-check',
		]);

		noUnwantedVMessages(codeOfConduct, [
			'awesome-code-of-conduct',
		]);
	});

	it('awesome-nodejs', async () => {
		const [readme, codeOfConduct] = await lint({filename: findReadmeFile('test/canonical/awesome-nodejs')});

		noUnwantedVMessages(readme, [
			'match-punctuation',
			'double-link',
			'awesome-heading',
			'awesome-list-item',
			'awesome-spell-check',
		]);

		noUnwantedVMessages(codeOfConduct, [
			'awesome-code-of-conduct',
		]);
	});
});
