import test from 'ava';
import execa from 'execa';

test(async t => {
	const err = await t.throws(execa.stdout('../cli.js', ['fixtures/main.md']));
	t.regex(err.message, /Missing Awesome badge/);
});
