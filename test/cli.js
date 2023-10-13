import test from 'ava';
import {execa} from 'execa';

test('main', async t => {
	await t.throwsAsync(
		execa('./cli.js', ['test/fixtures/main.md']),
		{
			message: /Missing Awesome badge/,
		},
	);
});

test('main - non-existent file', async t => {
	await t.throwsAsync(
		execa('./cli.js', ['test/fixtures/non-existent.md']),
		{
			message: /Couldn't find the file/,
		},
	);
});

test('main - invalid GitHub repository', async t => {
	await t.throwsAsync(
		execa('./cli.js', ['https://github.com/sindresorhus/awesome-lint/blob/main/readme.md']),
		{
			message: /Invalid GitHub repo URL/,
		},
	);
});
