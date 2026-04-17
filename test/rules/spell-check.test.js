import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import lintRaw from '../../index.js';
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

	it('spell-check - violations are warnings, not errors', async () => {
		const vfiles = await lintRaw({config, filename: 'test/fixtures/spell-check/error0.md'});
		const messages = vfiles.flatMap(vfile => vfile.messages);
		assert.ok(messages.length > 0);
		assert.ok(messages.every(m => m.fatal !== true));
	});

	it('spell-check - ambiguous words', async () => {
		const messages = await lint({config, filename: 'test/fixtures/spell-check/ambiguous-words.md'});
		// Should only flag words in product/framework context (9 warnings expected)
		const spellWarnings = messages.filter(m => m.message?.includes('should be written as'));
		// These are the expected warnings from the "Product/framework context" section
		assert.equal(spellWarnings.length, 9);
	});

	it('spell-check - standalone product names in markdown nodes', async () => {
		const messages = await lint({config, filename: 'test/fixtures/spell-check/standalone-product-names.md'});
		const spellWarnings = messages.map(message => message.message);

		for (const expectedMessage of [
			'Text "babel" should be written as "Babel" (if referring to the technology)',
			'Text "parcel" should be written as "Parcel" (if referring to the technology)',
			'Text "mocha" should be written as "Mocha" (if referring to the technology)',
			'Text "slack" should be written as "Slack" (if referring to the technology)',
			'Text "blender" should be written as "Blender" (if referring to the technology)',
			'Text "jasmine" should be written as "Jasmine" (if referring to the technology)',
			'Text "llama" should be written as "LLaMA" (if referring to the technology)',
			'Text "alpine" should be written as "Alpine" (if referring to the technology)',
			'Text "rider" should be written as "Rider" (if referring to the technology)',
			'Text "eclipse" should be written as "Eclipse" (if referring to the technology)',
			'Text "mercurial" should be written as "Mercurial" (if referring to the technology)',
			'Text "insomnia" should be written as "Insomnia" (if referring to the technology)',
		]) {
			assert.ok(spellWarnings.includes(expectedMessage), expectedMessage);
		}

		assert.ok(!spellWarnings.some(message => message.includes('Text ""')), 'Should not emit empty-string warnings');
		assert.equal(spellWarnings.filter(message => message.includes('"parcel"')).length, 2);
		assert.equal(spellWarnings.filter(message => message.includes('"mocha"')).length, 2);
		assert.equal(spellWarnings.filter(message => message.includes('"slack"')).length, 2);
		assert.equal(spellWarnings.filter(message => message.includes('"blender"')).length, 2);
		assert.equal(spellWarnings.filter(message => message.includes('"babel"')).length, 2);
		assert.equal(spellWarnings.length, 17);
	});
});
