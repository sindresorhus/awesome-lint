import test from 'ava';
import m from '../_lint';

const config = {
	plugins: [
		require('remark-lint'),
		require('../../rules/list-item')
	]
};

test('list-item - valid', async t => {
	const messages = await m({config, filename: 'test/fixtures/list-item/0.md'});
	t.deepEqual(messages, []);
});

test('list-item - invalid', async t => {
	const messages = await m({config, filename: 'test/fixtures/list-item/1.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/list-item',
			message: 'List item description must start with valid casing'
		},
		{
			ruleId: 'awesome/list-item',
			message: 'List item description must start with valid casing'
		},
		{
			ruleId: 'awesome/list-item',
			message: 'List item link and description must be separated with a dash'
		},
		{
			ruleId: 'awesome/list-item',
			message: 'List item description must end with proper punctuation'
		},
		{
			ruleId: 'awesome/list-item',
			message: 'List item description must end with proper punctuation'
		},
		{
			ruleId: 'awesome/list-item',
			message: 'Invalid list item link URL'
		},
		{
			ruleId: 'awesome/list-item',
			message: 'Invalid list item link URL'
		},
		{
			ruleId: 'awesome/list-item',
			message: 'Invalid list item link'
		},
		{
			ruleId: 'awesome/list-item',
			message: 'List item description must start with valid casing'
		},
		{
			ruleId: 'awesome/list-item',
			message: 'List item description must start with valid casing'
		}
	]);
});

test('list-item - valid ignoring Contents section', async t => {
	const messages = await m({config, filename: 'test/fixtures/list-item/2.md'});
	t.deepEqual(messages, []);
});
