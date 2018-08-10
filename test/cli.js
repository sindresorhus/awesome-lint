import test from 'ava';
import execa from 'execa';

test('main', async t => {
	const error = await t.throws(execa.stdout('./cli.js', ['test/fixtures/main.md']));
	t.regex(error.message, /Missing Awesome badge/);
});
