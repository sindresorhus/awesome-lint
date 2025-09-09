import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {execa} from 'execa';

describe('cli', () => {
	it('main', async () => {
		await assert.rejects(
			execa('./cli.js', ['test/fixtures/main.md']),
			{
				message: /Missing Awesome badge/,
			},
		);
	});

	it('main - non-existent file', async () => {
		await assert.rejects(
			execa('./cli.js', ['test/fixtures/non-existent.md']),
			{
				message: /Couldn't find the file/,
			},
		);
	});

	it('main - invalid GitHub repository', async () => {
		await assert.rejects(
			execa('./cli.js', ['https://github.com/sindresorhus/awesome-lint/blob/main/readme.md']),
			{
				message: /Invalid GitHub repo URL/,
			},
		);
	});
});
