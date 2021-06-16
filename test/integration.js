import test from 'ava';
import lint from '..';
import findReadmeFile from '../lib/find-readme-file.js';

/**
Verify there are no `VMessages` in the `VFile`, except for certain rule IDs.

@param {import('ava').ExecutionContext} t - AVA test context.
@param {VFile} vFile - `VFile` with a list of messages.
@param {string[]} expectedRuleIds - Rule IDs for messages you expect to see.
*/
function noUnwantedVMessages(t, vFile, expectedRuleIds) {
	const seenRules = new Set(vFile.messages.map(vMessage => vMessage.ruleId));

	t.deepEqual([...seenRules], expectedRuleIds);
}

test('awesome', async t => {
	const [readme, codeOfConduct] = await lint({filename: findReadmeFile('test/canonical/awesome')});

	noUnwantedVMessages(t, readme, [
		'match-punctuation',
		'awesome-heading'
	]);

	noUnwantedVMessages(t, codeOfConduct, [
		'awesome-code-of-conduct'
	]);
});

test('awesome-nodejs', async t => {
	const [readme, codeOfConduct] = await lint({filename: findReadmeFile('test/canonical/awesome-nodejs')});

	noUnwantedVMessages(t, readme, [
		'match-punctuation',
		'double-link',
		'awesome-heading',
		'awesome-list-item'
	]);

	noUnwantedVMessages(t, codeOfConduct, [
		'awesome-code-of-conduct'
	]);
});
