import test from 'ava';
import m from '../';

test('badge', async t => {
	t.is((await m({filename: 'fixtures/badge.md'})).messages[0].ruleId, 'awesome-badge');
});
