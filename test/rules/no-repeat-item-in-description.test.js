import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {remark} from 'remark';
import remarkLint from 'remark-lint';
import noRepeatItemInDescriptionRule from '../../rules/no-repeat-item-in-description.js';

const runTest = async markdown => {
	const result = await remark()
		.use(remarkLint)
		.use(noRepeatItemInDescriptionRule)
		.process(markdown);
	return result;
};

describe('no-repeat-item-in-description', () => {
	it('should detect when description starts with item name', async () => {
		const markdown = `# Test

- [Awesome Tool](https://example.com) - Awesome Tool is a great utility.
- [Another Tool](https://example.com) - Another Tool - the best tool ever.
`;

		const result = await runTest(markdown);
		const messages = result.messages.filter(m => m.ruleId === 'no-repeat-item-in-description');

		assert.equal(messages.length, 2, 'Should detect both violations');
		assert.ok(messages[0].message.includes('Awesome Tool'));
		assert.ok(messages[1].message.includes('Another Tool'));
	});

	it('should not flag valid descriptions', async () => {
		const markdown = `# Test

- [SSPy](https://example.com) - Python version of SSPak that handles larger assets.
- [Node.js](https://nodejs.org) - JavaScript runtime built on Chrome's V8.
- [React](https://react.dev) - A JavaScript library for building user interfaces.
`;

		const result = await runTest(markdown);
		const messages = result.messages.filter(m => m.ruleId === 'no-repeat-item-in-description');

		assert.equal(messages.length, 0, 'Should not flag valid descriptions');
	});

	it('should handle case-insensitive matching', async () => {
		const markdown = `# Test

- [MyApp](https://example.com) - myapp is great.
- [TestLib](https://example.com) - TESTLIB provides utilities.
`;

		const result = await runTest(markdown);
		const messages = result.messages.filter(m => m.ruleId === 'no-repeat-item-in-description');

		assert.equal(messages.length, 2, 'Should detect case-insensitive matches');
	});

	it('should not flag when item name appears later in description', async () => {
		const markdown = `# Test

- [SSPy](https://example.com) - Python version of SSPak. SSPy has no limit.
- [Tool](https://example.com) - A utility that extends Tool functionality.
`;

		const result = await runTest(markdown);
		const messages = result.messages.filter(m => m.ruleId === 'no-repeat-item-in-description');

		assert.equal(messages.length, 0, 'Should only check start of description');
	});

	it('should not flag partial matches at the start', async () => {
		const markdown = `# Test

- [Node](https://example.com) - NodeJS is a runtime.
- [Java](https://example.com) - JavaScript is different.
`;

		const result = await runTest(markdown);
		const messages = result.messages.filter(m => m.ruleId === 'no-repeat-item-in-description');

		assert.equal(messages.length, 0, 'Should not flag partial word matches');
	});

	it('should skip badge links and find the main item link', async () => {
		const markdown = `# Test

- [![CI](https://badge.svg)](https://ci.com) [Tool](https://example.com) - Tool is great.
- [![Badge](https://badge.svg)](https://badge.com) [App](https://example.com) - App provides features.
`;

		const result = await runTest(markdown);
		const messages = result.messages.filter(m => m.ruleId === 'no-repeat-item-in-description');

		assert.equal(messages.length, 2, 'Should detect violations using correct item names');
		assert.ok(messages[0].message.includes('"Tool"'), 'Should use Tool, not CI');
		assert.ok(messages[1].message.includes('"App"'), 'Should use App, not Badge');
	});

	it('should handle formatting between link and separator', async () => {
		const markdown = `# Test

- [Tool](https://example.com) **NEW** - Tool is amazing.
- [Library](https://example.com) *deprecated* - Library provides functions.
- [Package](https://example.com) \`v2.0\` - Package helps with tasks.
`;

		const result = await runTest(markdown);
		const messages = result.messages.filter(m => m.ruleId === 'no-repeat-item-in-description');

		assert.equal(messages.length, 3, 'Should detect violations even with formatting between link and separator');
	});

	it('should handle multiple dashes in description', async () => {
		const markdown = `# Test

- [Tool](https://example.com) - A utility - Tool - with many features.
- [App](https://example.com) - App - the best - really.
`;

		const result = await runTest(markdown);
		const messages = result.messages.filter(m => m.ruleId === 'no-repeat-item-in-description');

		// First should not flag (doesn't start with "Tool")
		// Second should flag (starts with "App")
		assert.equal(messages.length, 1, 'Should handle multiple dashes correctly');
		assert.ok(messages[0].message.includes('"App"'));
	});

	it('should handle descriptions with colons after item name', async () => {
		const markdown = `# Test

- [Redis](https://example.com) - Redis: in-memory data structure store.
- [MySQL](https://example.com) - MySQL: relational database.
`;

		const result = await runTest(markdown);
		const messages = result.messages.filter(m => m.ruleId === 'no-repeat-item-in-description');

		assert.equal(messages.length, 2, 'Should detect when followed by colon');
	});
});
