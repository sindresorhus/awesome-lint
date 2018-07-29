import test from 'ava';
import m from '../..';

test('toc - success basic', async t => {
	const result = (await m({filename: 'test/fixtures/toc0.md'})).messages;
	t.deepEqual(result, []);
});

test('toc - success sub-lists', async t => {
	const result = (await m({filename: 'test/fixtures/toc1.md'})).messages;
	t.deepEqual(result, []);
});

test('toc - missing', async t => {
	const result = (await m({filename: 'test/fixtures/toc2.md'})).messages[0];
	t.is(result.ruleId, 'awesome/toc');
	t.is(result.message, 'Missing or invalid Table of Contents');
});

test('toc - missing items', async t => {
	const {messages} = await m({filename: 'test/fixtures/toc3.md'});
	t.is(messages.length, 3);
	t.is(messages[0].ruleId, 'awesome/toc');
	t.is(messages[0].message, 'ToC missing item for "Foo B"');
	t.is(messages[1].ruleId, 'awesome/toc');
	t.is(messages[1].message, 'ToC item "Bar" does not match corresponding heading "Bar A"');
	t.is(messages[2].ruleId, 'awesome/toc');
	t.is(messages[2].message, 'ToC missing item for "Baz"');
});
