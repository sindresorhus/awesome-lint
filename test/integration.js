import test from 'ava';
import execa from 'execa';
import path from 'path';

const cli = path.resolve(__dirname, '../cli.js');

test('awesome-nodejs', async t => {
	await t.notThrowsAsync(
		execa.stdout(cli, {cwd: 'test/canonical/awesome-nodejs'})
	);
});
