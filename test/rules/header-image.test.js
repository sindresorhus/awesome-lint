import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import headerImageRule from '../../rules/header-image.js';

describe('rules › header-image', () => {
	const config = {
		plugins: [
			remarkLint,
			headerImageRule,
		],
	};

	it('header-image - success (svg)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/success-svg.md'});
		assert.deepEqual(messages, []);
	});

	it('header-image - success (@2x)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/success-2x.md'});
		assert.deepEqual(messages, []);
	});

	it('header-image - error (non-hidpi png)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/error-png.md'});
		assert.deepEqual(messages, [
			{
				line: 1,
				ruleId: 'awesome-header-image',
				message: 'Header image must be SVG or high-DPI (e.g. @2x, or 2× pixel dimensions)',
			},
		]);
	});
});
