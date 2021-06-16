import test from 'ava';
import lint from '../_lint.js';

const config = {
	plugins: [
		require('remark-lint'),
		require('../../rules/spell-check.js')
	]
};

test('spell-check - success', async t => {
	const messages = await lint({config, filename: 'test/fixtures/spell-check/success0.md'});
	t.deepEqual(messages, []);
});

test('spell-check - error', async t => {
	const messages = await lint({config, filename: 'test/fixtures/spell-check/error0.md'});
	t.snapshot(messages);
});
