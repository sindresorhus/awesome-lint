import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import licenseRule from '../../rules/license.js';

describe('rules › license', () => {
	const config = {
		plugins: [
			remarkLint,
			licenseRule,
		],
	};

	it('licence - forbidden section', async () => {
		const messages = await lint({config, filename: 'test/fixtures/license/error0.md'});
		assert.deepEqual(messages, [
			{
				line: 11,
				ruleId: 'awesome-license',
				message: 'Forbidden license section found',
			},
		]);
	});

	it('license - forbidden empty section', async () => {
		const messages = await lint({config, filename: 'test/fixtures/license/error1.md'});
		assert.deepEqual(messages, [
			{
				line: 11,
				ruleId: 'awesome-license',
				message: 'Forbidden license section found',
			},
		]);
	});

	it('license - forbidden last section', async () => {
		const messages = await lint({config, filename: 'test/fixtures/license/error2.md'});
		assert.deepEqual(messages, [
			{
				line: 7,
				ruleId: 'awesome-license',
				message: 'Forbidden license section found',
			},
		]);
	});

	it('license - forbidden heading depth section', async () => {
		const messages = await lint({config, filename: 'test/fixtures/license/error3.md'});
		assert.deepEqual(messages, [
			{
				line: 11,
				ruleId: 'awesome-license',
				message: 'Forbidden license section found',
			},
		]);
	});

	it('license - forbidden image section', async () => {
		const messages = await lint({config, filename: 'test/fixtures/license/error4.md'});
		assert.deepEqual(messages, [
			{
				line: 1,
				ruleId: 'awesome-license',
				message: 'Forbidden license section found',
			},
		]);
	});

	it('license - success', async () => {
		const messages = await lint({config, filename: 'test/fixtures/license/success0.md'});
		assert.deepEqual(messages, []);
	});
});
