import test from 'ava';
import m from '../';

async function run(fileName, ruleId) {
	const results = (await m({filename: fileName})).messages;
	return results.filter(result => result.ruleId === ruleId);
}

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
	const results = await run('fixtures/list-item/1.md', 'awesome-list-item');
	t.is(results.length, 4);
	const expected = [
		'List items must start with `- [name](link)`',
		'The description of a list item must contain only plain text and/or `code`'
	];
	for (const result of results) {
		t.true(expected.includes(result.message));
	}
});

test('list-item - missing dash between link and description', async t => {
	const results = await run('fixtures/list-item/2.md', 'awesome-list-item');
	t.is(results.length, 1);
	for (const result of results) {
		t.is(result.message, 'List items must have a ` - ` between the link and the description');
	}
});

test('list-item - description does not starts with camelCase, uppercase or `code`', async t => {
	const results = await run('fixtures/list-item/3.md', 'awesome-list-item');
	t.is(results.length, 2);
	for (const result of results) {
		t.is(result.message, 'The description must start with an uppercase, camelCase word or `code`');
	}
});

test('list-item – description must end with a . or !', async t => {
	const results = await run('fixtures/list-item/4.md', 'awesome-list-item');
	t.is(results.length, 2);
	for (const result of results) {
		t.is(result.message, 'The description of a list item must end with `.` or `!`');
	}
});

test('list-item – nested lists', async t => {
	const results = await run('fixtures/list-item/5.md', 'awesome-list-item');
	t.is(results.length, 0);
});

test('list-item – list with all items with no description', async t => {
	const results = await run('fixtures/list-item/6.md', 'awesome-list-item');
	t.is(results.length, 0);
});

test('list-item – item without description', async t => {
	const results = await run('fixtures/list-item/7.md', 'awesome-list-item');
	t.is(results.length, 1);
	for (const result of results) {
		t.is(result.message, 'List items must have a description');
	}
});

test('list-item – only allow plain text and `code` in the description', async t => {
	const results = await run('fixtures/list-item/8.md', 'awesome-list-item');
	t.is(results.length, 1);
	for (const result of results) {
		t.is(result.message, 'The description of a list item must contain only plain text and/or `code`');
	}
});

test('list-item – do not throw when `- [name](link) description`', async t => {
	t.notThrows(m({filename: 'fixtures/list-item/9.md'}));
});
