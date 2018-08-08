import test from 'ava';
import m from '../_lint';

const config = {
	plugins: [
		require('remark-lint'),
		require('../../rules/toc')
	]
};

test('toc - success basic', async t => {
	const messages = await m({config, filename: 'test/fixtures/toc/0.md'});
	t.deepEqual(messages, []);
});

test('toc - success sub-lists', async t => {
	const messages = await m({config, filename: 'test/fixtures/toc/1.md'});
	t.deepEqual(messages, []);
});

test('toc - missing', async t => {
	const messages = await m({config, filename: 'test/fixtures/toc/2.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/toc',
			message: 'Missing or invalid Table of Contents'
		}
	]);
});

test('toc - missing items', async t => {
	const messages = await m({config, filename: 'test/fixtures/toc/3.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/toc',
			message: 'ToC missing item for "Foo B"'
		},
		{
			ruleId: 'awesome/toc',
			message: 'ToC item "Bar" does not match corresponding heading "Bar A"'
		},
		{
			ruleId: 'awesome/toc',
			message: 'ToC missing item for "Baz"'
		}
	]);
});

test('toc - exceed max depth', async t => {
	const messages = await m({config, filename: 'test/fixtures/toc/4.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/toc',
			message: 'Exceeded max depth of 2 levels'
		}
	]);
});

test('toc - success ignore contributing section', async t => {
	const messages = await m({config, filename: 'test/fixtures/toc/5.md'});
	t.deepEqual(messages, []);
});

test('toc - success html intro', async t => {
	const messages = await m({config, filename: 'test/fixtures/toc/6.md'});
	t.deepEqual(messages, []);
});
