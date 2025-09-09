import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import lint from '../_lint.js';
import contributingPlugin from '../../rules/contributing.js';

describe('rules › contributing', () => {
	const config = {
		plugins: [
			contributingPlugin,
		],
	};

	it('contributing - missing', async () => {
		const messages = await lint({config, filename: 'test/fixtures/contributing/error0/readme.md'});
		assert.deepEqual(messages, [
			{
				line: undefined,
				ruleId: 'awesome-contributing',
				message: 'Missing file contributing.md',
			},
		]);
	});

	it('contributing - empty', async () => {
		const messages = await lint({config, filename: 'test/fixtures/contributing/error1/readme.md'});
		assert.deepEqual(messages, [
			{
				line: undefined,
				ruleId: 'awesome-contributing',
				message: 'contributing.md file must not be empty',
			},
		]);
	});

	it('contributing - valid CONTRIBUTING.md', async () => {
		const messages = await lint({config, filename: 'test/fixtures/contributing/valid0/readme.md'});
		assert.deepEqual(messages, []);
	});

	it('contributing - valid contributing.md', async () => {
		const messages = await lint({config, filename: 'test/fixtures/contributing/valid1/readme.md'});
		assert.deepEqual(messages, []);
	});

	it('contributing - valid .github/CONTRIBUTING.md', async () => {
		const messages = await lint({config, filename: 'test/fixtures/contributing/valid2/readme.md'});
		assert.deepEqual(messages, []);
	});

	it('contributing - valid .github/contributing.md', async () => {
		const messages = await lint({config, filename: 'test/fixtures/contributing/valid3/readme.md'});
		assert.deepEqual(messages, []);
	});
});
