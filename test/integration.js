import test from 'ava';
import execa from 'execa';
import path from 'path';

const cli = path.resolve(__dirname, '../cli.js');

/**
Factory function for checking lint errors printed by awesome-lint CLI.
@param t AVA test context.
@param {string} stdout CLI output.
@param {number} numberOfErrors How many lint errors to expect.
@returns Assertion function taking line column, lint message, and rule name as parameters.
*/
function expectLintErrors(t, stdout, numberOfErrors) {
	t.regex(stdout, new RegExp(`${numberOfErrors} errors`));

	return (lineColumn, message, rule) => {
		t.regex(stdout, new RegExp(`${lineColumn}\\s+${message}\\s+remark-lint:${rule}`));
	};
}

test('awesome', async t => {
	const {stdout} = await t.throwsAsync(
		execa.stdout(cli, {cwd: 'test/canonical/awesome'})
	);

	const expectLintError = expectLintErrors(t, stdout, 3);
	expectLintError('1:1', 'Missing main list heading', 'awesome-heading');
	expectLintError('55:12', '"’" is used without matching "‘"', 'match-punctuation');
	expectLintError('57:1', 'The default email must be replaced with yours', 'awesome-code-of-conduct');
});

test('awesome-nodejs', async t => {
	const {stdout} = await t.throwsAsync(
		execa.stdout(cli, {cwd: 'test/canonical/awesome-nodejs'})
	);

	const expectLintError = expectLintErrors(t, stdout, 11);
	expectLintError('1:1', 'Missing main list heading', 'awesome-heading');
	expectLintError('56:12', '"’" is used without matching "‘"', 'match-punctuation');
	expectLintError('195:3', 'https://github.com/sindresorhus/cpy', 'double-link');
	expectLintError('262:3', 'https://github.com/sindresorhus/got', 'double-link');
	expectLintError('273:84', 'https://github.com/sindresorhus/got', 'double-link');
	expectLintError('420:3', 'https://github.com/sindresorhus/cpy', 'double-link');
	expectLintError('453:4', 'https://github.com/sindresorhus/awesome-observables', 'double-link');
	expectLintError('454:4', 'https://github.com/sindresorhus/awesome-observables', 'double-link');
	expectLintError('812:106', '"”" is used without matching "“"', 'match-punctuation');
	expectLintError('858:58', 'List item link and description must be separated with a dash', 'awesome-list-item');
	expectLintError('57:1', 'The default email must be replaced with yours', 'awesome-code-of-conduct');
});
