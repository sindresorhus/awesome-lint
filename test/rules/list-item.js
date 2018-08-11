import test from 'ava';
import lint from '../_lint';

const config = {
	plugins: [
		require('remark-lint'),
		require('../../rules/list-item')
	]
};

test('list-item - valid', async t => {
	const messages = await lint({config, filename: 'test/fixtures/list-item/0.md'});
	t.deepEqual(messages, []);
});

test('list-item - invalid', async t => {
	const messages = await lint({config, filename: 'test/fixtures/list-item/1.md'});
	t.snapshot(messages);
});

test('list-item - valid ignoring Contents section', async t => {
	const messages = await lint({config, filename: 'test/fixtures/list-item/2.md'});
	t.deepEqual(messages, []);
});
