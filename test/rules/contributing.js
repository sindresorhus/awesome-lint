import test from 'ava';
import lint from '../_lint.js';

const config = {
	plugins: [
		require('../../rules/contributing.js')
	]
};

test('contributing - missing', async t => {
	const messages = await lint({config, filename: 'test/fixtures/contributing/error0/readme.md'});
	t.deepEqual(messages, [
		{
			line: null,
			ruleId: 'awesome-contributing',
			message: 'Missing file contributing.md'
		}
	]);
});

test('contributing - empty', async t => {
	const messages = await lint({config, filename: 'test/fixtures/contributing/error1/readme.md'});
	t.deepEqual(messages, [
		{
			line: null,
			ruleId: 'awesome-contributing',
			message: 'contributing.md file must not be empty'
		}
	]);
});

test('contributing - valid CONTRIBUTING.md', async t => {
	const messages = await lint({config, filename: 'test/fixtures/contributing/valid0/readme.md'});
	t.deepEqual(messages, []);
});

test('contributing - valid contributing.md', async t => {
	const messages = await lint({config, filename: 'test/fixtures/contributing/valid1/readme.md'});
	t.deepEqual(messages, []);
});

test('contributing - valid .github/CONTRIBUTING.md', async t => {
	const messages = await lint({config, filename: 'test/fixtures/contributing/valid2/readme.md'});
	t.deepEqual(messages, []);
});

test('contributing - valid .github/contributing.md', async t => {
	const messages = await lint({config, filename: 'test/fixtures/contributing/valid3/readme.md'});
	t.deepEqual(messages, []);
});
