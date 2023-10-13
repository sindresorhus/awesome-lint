import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import findAuthorName from '../../lib/find-author-name.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('findAuthorName - parse repo URL', t => {
	t.is(findAuthorName({repoURL: 'https://github.com/sindresorhus/awesome-lint'}), 'sindresorhus');
});

test('findAuthorName - parse package.json', t => {
	t.is(findAuthorName({dirname: path.resolve(__dirname, '../../')}), 'sindresorhus');
});
