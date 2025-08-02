import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {test, expect} from 'vitest';
import findAuthorName from '../../lib/find-author-name.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('findAuthorName - parse repo URL', () => {
	const author = findAuthorName({repoURL: 'https://github.com/sindresorhus/awesome-lint'});
	expect(author).toBe('sindresorhus');
});

test('findAuthorName - parse package.json', () => {
	const author = findAuthorName({dirname: path.resolve(__dirname, '../../')});
	expect(author).toBe('sindresorhus');
});

