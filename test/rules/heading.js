import test from 'ava';
import lint from '../_lint.js';

const config = {
	plugins: [
		require('remark-lint'),
		require('../../rules/heading.js')
	]
};

test('heading - missing', async t => {
	const messages = await lint({config, filename: 'test/fixtures/heading/error0.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-heading',
			message: 'Missing main list heading'
		}
	]);
});

test('heading - not in title case', async t => {
	const messages = await lint({config, filename: 'test/fixtures/heading/error1.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-heading',
			message: 'Main heading must be in title case'
		}
	]);
});

test('heading - more than one heading', async t => {
	const messages = await lint({config, filename: 'test/fixtures/heading/error2.md'});
	t.deepEqual(messages, [
		{
			line: 3,
			ruleId: 'awesome-heading',
			message: 'List can only have one heading'
		}
	]);
});

test('heading - depth is bigger than 1', async t => {
	const messages = await lint({config, filename: 'test/fixtures/heading/error3.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-heading',
			message: 'Main list heading must be of depth 1'
		}
	]);
});

test('heading - success', async t => {
	const messages = await lint({config, filename: 'test/fixtures/heading/success0.md'});
	t.deepEqual(messages, []);
});

test('heading - success (with acronyms)', async t => {
	const messages = await lint({config, filename: 'test/fixtures/heading/success1.md'});
	t.deepEqual(messages, []);
});
