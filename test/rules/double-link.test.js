import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import doubleLinkRule from '../../rules/double-link.js';

describe('rules › double-link', () => {
	const config = {
		plugins: [
			remarkLint,
			doubleLinkRule,
		],
	};

	it('duplicate links', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/duplicate.md'});
		assert.deepEqual(messages, [
			{
				line: 2,
				ruleId: 'double-link',
				message: 'Duplicate link: https://example.com',
			},
			{
				line: 3,
				ruleId: 'double-link',
				message: 'Duplicate link: https://example.com',
			},
		]);
	});

	it('unique links with different hashes', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/unique-hashes.md'});
		assert.deepEqual(messages, []);
	});

	it('duplicate links with same hash', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/duplicate-with-hash.md'});
		assert.deepEqual(messages, [
			{
				line: 2,
				ruleId: 'double-link',
				message: 'Duplicate link: https://playground.babylonjs.com/#58I88I#186',
			},
			{
				line: 3,
				ruleId: 'double-link',
				message: 'Duplicate link: https://playground.babylonjs.com/#58I88I#186',
			},
		]);
	});

	it('no duplicates', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/no-duplicates.md'});
		assert.deepEqual(messages, []);
	});

	it('duplicate anchor links', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/duplicate-anchors.md'});
		assert.deepEqual(messages, [
			{
				line: 2,
				ruleId: 'double-link',
				message: 'Duplicate link: #section',
			},
			{
				line: 3,
				ruleId: 'double-link',
				message: 'Duplicate link: #section',
			},
		]);
	});

	it('edge cases', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/edge-cases.md'});
		assert.deepEqual(messages, [
			{
				line: 2,
				ruleId: 'double-link',
				message: 'Duplicate link: javascript:void(0)',
			},
			{
				line: 3,
				ruleId: 'double-link',
				message: 'Duplicate link: javascript:void(0)',
			},
			{
				line: 4,
				ruleId: 'double-link',
				message: 'Duplicate link: ',
			},
			{
				line: 5,
				ruleId: 'double-link',
				message: 'Duplicate link: ',
			},
		]);
	});

	it('normalized duplicates', async () => {
		const messages = await lint({config, filename: 'test/fixtures/double-link/normalized-duplicates.md'});
		assert.deepEqual(messages, [
			{
				line: 2,
				ruleId: 'double-link',
				message: 'Duplicate link: https://example.com/',
			},
			{
				line: 3,
				ruleId: 'double-link',
				message: 'Duplicate link: https://example.com',
			},
			{
				line: 4,
				ruleId: 'double-link',
				message: 'Duplicate link: http://example.com/',
			},
		]);
	});
});
