import test from 'ava';
import execa from 'execa';

test('main', async t => {
	await t.throwsAsync(
		execa.stdout('./cli.js', ['test/fixtures/main.md']),
		/Missing Awesome badge/
	);
});

test('main - non-exsitent file', async t => {
	await t.throwsAsync(
		execa.stderr('./cli.js', ['test/fixtures/non-exsitent.md']),
		/Couldn't find the file/
	);
});

test('main - invalid Github repository', async t => {
	await t.throwsAsync(
		execa.stderr('./cli.js', ['https://github.com/sindresorhus/awesome-lint/blob/master/readme.md']),
		/Invalid Github repository url/
	);
});
