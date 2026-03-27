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

	it('passes when header image is SVG', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/success-svg.md'});
		assert.deepEqual(messages, []);
	});

	it('passes when header image has @2x in filename', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/success-hidpi-filename.md'});
		assert.deepEqual(messages, []);
	});

	it('passes when local image has 2x pixel dimensions', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/success-large-local.md'});
		assert.deepEqual(messages, []);
	});

	it('passes when no header image exists', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/success-no-image.md'});
		assert.deepEqual(messages, []);
	});

	it('passes when only badge image exists', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/success-badge-only.md'});
		assert.deepEqual(messages, []);
	});

	it('fails when local image is too small for displayed size', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/error-low-dpi.md'});
		assert.deepEqual(messages, [
			{
				line: 1,
				ruleId: 'awesome-header-image',
				message: 'Header image must be SVG or high-DPI (at least 2× pixel dimensions or @2x filename)',
			},
		]);
	});
});
