import test from 'ava';
import m from '..';

test('badge - missing', async t => {
	const result = (await m({filename: 'test/fixtures/badge.md'})).messages[0];
	t.is(result.ruleId, 'awesome/badge');
	t.is(result.message, 'Missing Awesome badge after the main heading');
});

test('badge - incorrect source', async t => {
	const result = (await m({filename: 'test/fixtures/badge2.md'})).messages[0];
	t.is(result.ruleId, 'awesome/badge');
	t.is(result.message, 'Incorrect badge source');
});
