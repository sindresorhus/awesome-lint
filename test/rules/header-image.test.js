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

	it('header-image - success (h1 followed by svg)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/success-h1-followed-by-svg.md'});
		assert.deepEqual(messages, []);
	});

	it('header-image - success (h1 followed by high-dpi png)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/success-h1-followed-by-high-dpi-png.md'});
		assert.deepEqual(messages, []);
	});

	it('header-image - success (html h1 svg)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/success-html-h1-svg.md'});
		assert.deepEqual(messages, []);
	});

	it('header-image - success (later images in header block)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/success-later-images-in-header-block.md'});
		assert.deepEqual(messages, []);
	});

	it('header-image - success (awesome badge)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/success-awesome-badge.md'});
		assert.deepEqual(messages, []);
	});

	it('header-image - error (h1 followed by low-dpi png)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/error-h1-followed-by-low-dpi-png.md'});
		assert.deepEqual(messages, [
			{
				line: 3,
				ruleId: 'awesome-header-image',
				message: 'Header image must be SVG or high-DPI',
			},
		]);
	});

	it('header-image - error (raster image without display size)', async () => {
		const messages = await lint({config, filename: 'test/fixtures/header-image/error-raster-without-display-size.md'});
		assert.deepEqual(messages, [
			{
				line: 3,
				ruleId: 'awesome-header-image',
				message: 'Header image must be SVG or high-DPI',
			},
		]);
	});
});
