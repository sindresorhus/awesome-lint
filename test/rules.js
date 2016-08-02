import test from 'ava';
import m from '../';

test('badge - missing', async t => {
	const result = (await m({filename: 'fixtures/badge.md'})).messages[0];
	t.is(result.ruleId, 'awesome-badge');
	t.is(result.message, 'Missing Awesome badge after the main heading');
});

test('badge - incorrect source', async t => {
	const result = (await m({filename: 'fixtures/badge2.md'})).messages[0];
	t.is(result.ruleId, 'awesome-badge');
	t.is(result.message, 'Incorrect badge source');
});

test('list-item - incorrect item prefix', async t => {
	const results = (await m({filename: 'fixtures/list-item/1.md'})).messages;
	for (const result of results) {
		t.is(result.ruleId, 'awesome-list-item');
		t.is(result.message, 'Items must start with \'- [name][link]\'');
	}
});

test('list-item - missing dash between link and description', async t => {
	const results = (await m({filename: 'fixtures/list-item/2.md'})).messages;
	for (const result of results) {
		t.is(result.ruleId, 'awesome-list-item');
		t.is(result.message, 'Items must have a \'-\' between the link and the description');
	}
});
