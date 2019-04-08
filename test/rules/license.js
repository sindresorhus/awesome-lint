import test from 'ava';
import lint from '../_lint';

const config = {
	plugins: [
		require('remark-lint'),
		require('remark-lint-no-empty-sections'),
		require('../../rules/license')
	]
};

test('license - missing', async t => {
	const messages = await lint({config, filename: 'test/fixtures/license/error0.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/license',
			message: 'Missing License section'
		}
	]);
});

test('license - empty', async t => {
	const messages = await lint({config, filename: 'test/fixtures/license/error1.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'no-empty-sections',
			message: 'Remove empty section: "License"'
		},
		{
			ruleId: 'awesome/license',
			message: 'License must not be empty'
		}
	]);
});

test('license - not last section', async t => {
	const messages = await lint({config, filename: 'test/fixtures/license/error2.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/license',
			message: 'License must be the last section'
		}
	]);
});

test('license - incorrect heading depth', async t => {
	const messages = await lint({config, filename: 'test/fixtures/license/error3.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/license',
			message: 'License section must be at heading depth 2'
		}
	]);
});

test('license - png image', async t => {
	const messages = await lint({config, filename: 'test/fixtures/license/error4.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/license',
			message: 'License image must be SVG'
		}
	]);
});

test('license - success', async t => {
	const messages = await lint({config, filename: 'test/fixtures/license/success0.md'});
	t.deepEqual(messages, []);
});
