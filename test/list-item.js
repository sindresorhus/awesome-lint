import test from 'ava';
import m from '..';

const config = {
	plugins: [
		require('remark-lint'),
		require('../rules/list-item')
	]
};

test('list-item - valid', async t => {
	const {messages} = (await m({config, filename: 'test/fixtures/list-item/0.md'}));
	t.is(messages.length, 0);
});

test('list-item - invalid', async t => {
	const {messages} = (await m({config, filename: 'test/fixtures/list-item/1.md'}));
	t.deepEqual(messages.map(err => ({ruleId: err.ruleId, message: err.message})), [
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
		}
	]);
});
