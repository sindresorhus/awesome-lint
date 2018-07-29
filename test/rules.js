import test from 'ava';
import m from '..';

test('badge - missing', async t => {
	const result = (await m({filename: 'test/fixtures/badge0.md'})).messages[0];
	t.is(result.ruleId, 'awesome/badge');
	t.is(result.message, 'Missing Awesome badge after the main heading');
});

test('badge - incorrect source', async t => {
	const result = (await m({filename: 'test/fixtures/badge1.md'})).messages[0];
	t.is(result.ruleId, 'awesome/badge');
	t.is(result.message, 'Invalid badge source');
});

test('badge - success (short)', async t => {
	const result = (await m({filename: 'test/fixtures/badge-success0.md'})).messages[0];
	t.is(result.ruleId, 'awesome/toc');
	t.is(result.message, 'Missing or invalid Table of Contents');
});

test('badge - success (long)', async t => {
	const result = (await m({filename: 'test/fixtures/badge-success1.md'})).messages[0];
	t.is(result.ruleId, 'awesome/toc');
	t.is(result.message, 'Missing or invalid Table of Contents');
});
