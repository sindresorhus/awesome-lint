import test from 'ava';
import execa from 'execa';

test('main', async t => {
	await t.throwsAsync(
		execa.stdout('./cli.js', ['test/fixtures/main.md']),
		/Missing Awesome badge/
	);
});
