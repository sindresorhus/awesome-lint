import test from 'ava';
import m from '../';

test('badge - missing', async t => {
	const result = (await m({filename: 'fixtures/badge.md'})).messages[0];
	t.is(result.ruleId, 'awesome/badge');
	t.is(result.message, 'Missing Awesome badge after the main heading');
});

test('badge - incorrect source', async t => {
	const result = (await m({filename: 'fixtures/badge2.md'})).messages[0];
	t.is(result.ruleId, 'awesome/badge');
	t.is(result.message, 'Incorrect badge source');
});

test('trailing slash - does not throw', async t => {
	const result = (await m({filename: 'fixtxures/trailing-slash.md'})).messages[0];
	t.is(result.ruleId, 'awesome/badge');
});
