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
	t.is(results.length, 2);
	for (const result of results) {
		t.is(result.message, 'List items must start with `- [name](link)`');
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

test('list-item – `Contents` section', async t => {
	const results = await run('fixtures/list-item/6.md', 'awesome-list-item');
	t.is(results.length, 0);
});

test('list-item – item without description', async t => {
	const results = await run('fixtures/list-item/7.md', 'awesome-list-item');
	t.is(results.length, 2);
	for (const result of results) {
		t.is(result.message, 'List items must have a description');
	}
});
