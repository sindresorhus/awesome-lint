import test from 'ava';
import m from '../_lint';

const config = {
	plugins: [
		require('remark-lint'),
		// TODO: remark-lint-no-empty-sections doesn't handle empty last section
		// https://github.com/vhf/remark-lint-no-empty-sections/issues/3
		require('remark-lint-no-empty-sections'),
		require('../../rules/license')
	]
};

test('license - missing', async t => {
	const messages = await m({config, filename: 'test/fixtures/license/error0.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/license',
			message: 'Missing License section'
		}
	]);
});

test('license - empty', async t => {
	const messages = await m({config, filename: 'test/fixtures/license/error1.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/license',
			message: 'License must not be empty'
		}
	]);
});

test('license - not last section', async t => {
	const messages = await m({config, filename: 'test/fixtures/license/error2.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/license',
			message: 'License must be the last section'
		}
	]);
});

test('license - incorrect heading depth', async t => {
	const messages = await m({config, filename: 'test/fixtures/license/error3.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/license',
			message: 'License section must be at heading depth 2'
		}
	]);
});

test('license - success', async t => {
	const messages = await m({config, filename: 'test/fixtures/license/success0.md'});
	t.deepEqual(messages, []);
});
