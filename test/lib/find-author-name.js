import path from 'path';
import test from 'ava';
import findAuthorName from '../../lib/find-author-name.js';

test('findAuthorName - parse repo URL', t => {
	t.is(findAuthorName({repoURL: 'https://github.com/sindresorhus/awesome-lint'}), 'sindresorhus');
});

test('findAuthorName - parse package.json', t => {
	t.is(findAuthorName({dirname: path.resolve(__dirname, '../../')}), 'sindresorhus');
});
