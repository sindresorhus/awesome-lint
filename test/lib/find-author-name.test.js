import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import findAuthorName from '../../lib/find-author-name.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('lib › find-author-name', () => {
	it('findAuthorName - parse repo URL', () => {
		assert.equal(findAuthorName({repoURL: 'https://github.com/sindresorhus/awesome-lint'}), 'sindresorhus');
	});

	it('findAuthorName - parse package.json', () => {
		assert.equal(findAuthorName({dirname: path.resolve(__dirname, '../../')}), 'sindresorhus');
	});
});
