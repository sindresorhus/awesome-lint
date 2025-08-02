import {test, expect} from 'vitest';
import lint from '../index.js';
import findReadmeFile from '../lib/find-readme-file.js';

/**
Verify there are no `VMessages` in the `VFile`, except for certain rule IDs.

@param {VFile} vFile - `VFile` with a list of messages.
@param {string[]} expectedRuleIds - Rule IDs for messages you expect to see.
*/
function noUnwantedVMessages(vFile, expectedRuleIds) {
	const seenRules = new Set(vFile.messages.map(vMessage => vMessage.ruleId));
	expect([...seenRules]).toEqual(expectedRuleIds);
}

/** 🧪 Test: canonical awesome repo */
test('awesome', async () => {
	const [readme, codeOfConduct] = await lint({
		filename: findReadmeFile('test/canonical/awesome'),
	});

	noUnwantedVMessages(readme, [
		'match-punctuation',
		'awesome-heading',
	]);

	noUnwantedVMessages(codeOfConduct, [
		'awesome-code-of-conduct',
	]);
});

/** 🧪 Test: awesome-nodejs repo */
test('awesome-nodejs', async () => {
	const [readme, codeOfConduct] = await lint({
		filename: findReadmeFile('test/canonical/awesome-nodejs'),
	});

	noUnwantedVMessages(readme, [
		'match-punctuation',
		'double-link',
		'awesome-heading',
		'awesome-list-item',
	]);

	noUnwantedVMessages(codeOfConduct, [
		'awesome-code-of-conduct',
	]);
});
