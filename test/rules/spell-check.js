import test from 'ava';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import spellCheckRule from '../../rules/spell-check.js';

const config = {
	plugins: [
		remarkLint,
		spellCheckRule,
	],
};

test('spell-check - success', async t => {
	const messages = await lint({config, filename: 'test/fixtures/spell-check/success0.md'});
	t.deepEqual(messages, []);
});

test('spell-check - error', async t => {
	const messages = await lint({config, filename: 'test/fixtures/spell-check/error0.md'});
	t.snapshot(messages);
});
