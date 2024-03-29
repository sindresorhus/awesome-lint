import test from 'ava';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import licenseRule from '../../rules/license.js';

const config = {
	plugins: [
		remarkLint,
		licenseRule,
	],
};

test('licence - forbidden section', async t => {
	const messages = await lint({config, filename: 'test/fixtures/license/error0.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-license',
			message: 'Forbidden license section found',
		},
	]);
});

test('license - forbidden empty section', async t => {
	const messages = await lint({config, filename: 'test/fixtures/license/error1.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-license',
			message: 'Forbidden license section found',
		},
	]);
});

test('license - forbidden last section', async t => {
	const messages = await lint({config, filename: 'test/fixtures/license/error2.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-license',
			message: 'Forbidden license section found',
		},
	]);
});

test('license - forbidden heading depth section', async t => {
	const messages = await lint({config, filename: 'test/fixtures/license/error3.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-license',
			message: 'Forbidden license section found',
		},
	]);
});

test('license - forbidden image section', async t => {
	const messages = await lint({config, filename: 'test/fixtures/license/error4.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-license',
			message: 'Forbidden license section found',
		},
	]);
});

test('license - success', async t => {
	const messages = await lint({config, filename: 'test/fixtures/license/success0.md'});
	t.deepEqual(messages, []);
});
