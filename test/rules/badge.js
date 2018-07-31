import test from 'ava';
import m from '../_lint';

const config = {
	plugins: [
		require('remark-lint'),
		require('../../rules/badge')
	]
};

test('badge - missing', async t => {
	const messages = await m({config, filename: 'test/fixtures/badge/error0.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/badge',
			message: 'Missing Awesome badge after the main heading'
		}
	]);
});

test('badge - incorrect source', async t => {
	const messages = await m({config, filename: 'test/fixtures/badge/error1.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/badge',
			message: 'Invalid badge source'
		}
	]);
});

test('badge - success (short)', async t => {
	const messages = await m({config, filename: 'test/fixtures/badge/success0.md'});
	t.deepEqual(messages, []);
});

test('badge - success (long)', async t => {
	const messages = await m({config, filename: 'test/fixtures/badge/success1.md'});
	t.deepEqual(messages, []);
});
