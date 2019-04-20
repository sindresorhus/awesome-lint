import path from 'path';
import test from 'ava';
import findAuthorName from '../../lib/find-author-name';

test('findAuthorName - parse repo URL', t => {
	t.deepEqual(findAuthorName({repoURL: 'https://github.com/sindresorhus/awesome-lint'}), 'sindresorhus');
});

test('findAuthorName - parse package.json', t => {
	t.deepEqual(findAuthorName({dirname: path.resolve(__dirname, '../../')}), 'sindresorhus');
});
