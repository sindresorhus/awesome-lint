import test from 'ava';
import m from '../_lint';

const config = {
	plugins: [
		require('../../rules/contributing')
	]
};

test('contributing - missing', async t => {
	const messages = await m({config, filename: 'test/fixtures/contributing/error0/readme.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/contributing',
			message: 'Missing file contributing.md'
		}
	]);
});

test('contributing - empty', async t => {
	const messages = await m({config, filename: 'test/fixtures/contributing/error1/readme.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/contributing',
			message: 'contributing.md file must not be empty'
		}
	]);
});

test('contributing - valid CONTRIBUTING.md', async t => {
	const messages = await m({config, filename: 'test/fixtures/contributing/valid0/readme.md'});
	t.deepEqual(messages, []);
});

test('contributing - valid contributing.md', async t => {
	const messages = await m({config, filename: 'test/fixtures/contributing/valid1/readme.md'});
	t.deepEqual(messages, []);
});
