import {test, expect} from 'vitest';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import licenseRule from '../../rules/license.js';

const config = {
	plugins: [remarkLint, licenseRule],
};

test('license - forbidden section', async () => {
	const messages = await lint({config, filename: 'test/fixtures/license/error0.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-license',
			message: 'Forbidden license section found',
		},
	]);
});

test('license - forbidden empty section', async () => {
	const messages = await lint({config, filename: 'test/fixtures/license/error1.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-license',
			message: 'Forbidden license section found',
		},
	]);
});

test('license - forbidden last section', async () => {
	const messages = await lint({config, filename: 'test/fixtures/license/error2.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-license',
			message: 'Forbidden license section found',
		},
	]);
});

test('license - forbidden heading depth section', async () => {
	const messages = await lint({config, filename: 'test/fixtures/license/error3.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-license',
			message: 'Forbidden license section found',
		},
	]);
});

test('license - forbidden image section', async () => {
	const messages = await lint({config, filename: 'test/fixtures/license/error4.md'});
	expect(messages).toEqual([
		{
			line: 1,
			ruleId: 'awesome-license',
			message: 'Forbidden license section found',
		},
	]);
});

test('license - success', async () => {
	const messages = await lint({config, filename: 'test/fixtures/license/success0.md'});
	expect(messages).toEqual([]);
});
