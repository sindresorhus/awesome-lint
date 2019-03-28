import test from 'ava';
import lint from '../_lint';

const config = {
	plugins: [
		require('remark-lint'),
		require('../../rules/heading')
	]
};

test('heading - missing', async t => {
	const messages = await lint({config, filename: 'test/fixtures/heading/error0.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/heading',
			message: 'Missing main list heading'
		}
	]);
});

test('heading - not in title case', async t => {
	const messages = await lint({config, filename: 'test/fixtures/heading/error1.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/heading',
			message: 'List heading must be in title case'
		}
	]);
});

test('heading - more than one heading', async t => {
	const messages = await lint({config, filename: 'test/fixtures/heading/error2.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/heading',
			message: 'List can only have one heading'
		}
	]);
});

test('heading - success', async t => {
	const messages = await lint({config, filename: 'test/fixtures/heading/success0.md'});
	t.deepEqual(messages, []);
});
