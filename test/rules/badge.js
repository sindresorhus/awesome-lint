import test from 'ava';
import lint from '../_lint.js';

const config = {
	plugins: [
		require('remark-lint'),
		require('../../rules/badge.js')
	]
};

test('badge - missing', async t => {
	const messages = await lint({config, filename: 'test/fixtures/badge/error0.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-badge',
			message: 'Missing Awesome badge after the main heading'
		}
	]);
});

test('badge - incorrect source', async t => {
	const messages = await lint({config, filename: 'test/fixtures/badge/error1.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-badge',
			message: 'Invalid badge source'
		}
	]);
});

test('badge - incorrect source raw git', async t => {
	const messages = await lint({config, filename: 'test/fixtures/badge/error2.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-badge',
			message: 'Invalid badge source'
		}
	]);
});

test('badge - success (short)', async t => {
	const messages = await lint({config, filename: 'test/fixtures/badge/success0.md'});
	t.deepEqual(messages, []);
});

test('badge - success (long)', async t => {
	const messages = await lint({config, filename: 'test/fixtures/badge/success1.md'});
	t.deepEqual(messages, []);
});

test('badge - success (new badge)', async t => {
	const messages = await lint({config, filename: 'test/fixtures/badge/success2.md'});
	t.deepEqual(messages, []);
});
