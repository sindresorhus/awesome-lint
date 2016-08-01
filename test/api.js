import test from 'ava';
import m from '../';

test('main', async t => {
	t.true((await m({filename: 'fixtures/main.md'})).messages.length > 0);
});
