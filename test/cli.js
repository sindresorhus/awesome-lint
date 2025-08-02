import {test, expect} from 'vitest';
import {execa} from 'execa';

test('main', async () => {
	await expect(execa('./cli.js', ['test/fixtures/main.md'])).rejects.toThrow(/Missing Awesome badge/);
});

test('main - non-existent file', async () => {
	await expect(execa('./cli.js', ['test/fixtures/non-existent.md'])).rejects.toThrow(/Couldn't find the file/);
});

test('main - invalid GitHub repository', async () => {
	await expect(execa('./cli.js', ['https://github.com/sindresorhus/awesome-lint/blob/main/readme.md'])).rejects.toThrow(/Invalid GitHub repo URL/);
});
