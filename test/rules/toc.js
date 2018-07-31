import test from 'ava';
import m from '../..';

const config = {
	plugins: [
		require('remark-lint'),
		require('../../rules/toc')
	]
};

test('toc - success basic', async t => {
	const result = (await m({config, filename: 'test/fixtures/toc/0.md'})).messages;
	t.deepEqual(result, []);
});

test('toc - success sub-lists', async t => {
	const result = (await m({config, filename: 'test/fixtures/toc/1.md'})).messages;
	t.deepEqual(result, []);
});

test('toc - missing', async t => {
	const result = (await m({config, filename: 'test/fixtures/toc/2.md'})).messages[0];
	t.is(result.ruleId, 'awesome/toc');
	t.is(result.message, 'Missing or invalid Table of Contents');
});

test('toc - missing items', async t => {
	const {messages} = await m({config, filename: 'test/fixtures/toc/3.md'});
	t.is(messages.length, 3);
	t.is(messages[0].ruleId, 'awesome/toc');
	t.is(messages[0].message, 'ToC missing item for "Foo B"');
	t.is(messages[1].ruleId, 'awesome/toc');
	t.is(messages[1].message, 'ToC item "Bar" does not match corresponding heading "Bar A"');
	t.is(messages[2].ruleId, 'awesome/toc');
	t.is(messages[2].message, 'ToC missing item for "Baz"');
});

test('toc - exceed max depth', async t => {
	const result = (await m({config, filename: 'test/fixtures/toc/4.md'})).messages[0];
	t.is(result.ruleId, 'awesome/toc');
	t.is(result.message, 'Exceeded max depth of 2 levels');
});
