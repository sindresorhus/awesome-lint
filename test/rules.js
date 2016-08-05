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
	t.plan(2);
	let messages = (await m({filename: 'fixtures/list-item/1.md'})).messages;
	messages = messages.filter(message => message.ruleId === 'awesome-list-item');
	messages.forEach(message => t.is(message.message, 'List items must start with `- [name](link)`'));
});

test('list-item - missing dash between link and description', async t => {
	t.plan(1);
	let messages = (await m({filename: 'fixtures/list-item/2.md'})).messages;
	messages = messages.filter(message => message.ruleId === 'awesome-list-item');
	messages.forEach(message => t.is(message.message, 'List items must have a ` - ` between the link and the description'));
});

test('list-item - description does not starts with camelCase, uppercase or `code`', async t => {
	t.plan(2);
	let messages = (await m({filename: 'fixtures/list-item/3.md'})).messages;
	messages = messages.filter(message => message.ruleId === 'awesome-list-item');
	messages.forEach(message => t.is(message.message, 'The description must start with an uppercase, camelCase world or `code`'));
});

test('list-item – description must end with a . or !', async t => {
	t.plan(2);
	let messages = (await m({filename: 'fixtures/list-item/4.md'})).messages;
	messages = messages.filter(message => message.ruleId === 'awesome-list-item');
	messages.forEach(message => t.is(message.message, 'The description of a list item must end with `.` or `!`'));
});
