import test from 'ava';
import m from '../';

const chalk = require('chalk');

test('badge - missing', async t => {
	const result = (await m({filename: 'fixtures/badge.md'})).messages[0];
	t.is(result.ruleId, 'awesome-badge');
	t.is(result.message, 'Missing Awesome badge after the main heading');
});

test('badge - incorrect source', async t => {
	const result = (await m({filename: 'fixtures/badge2.md'})).messages[0];
	t.is(result.ruleId, 'awesome-badge');
	t.is(result.message, 'Incorrect badge source');
});

test('table-of-contents - first section is not `Contents`', async t => {
	const result = (await m({filename: 'fixtures/table-of-contents/1.md'})).messages[0];
	t.is(result.ruleId, 'awesome-table-of-contents');
	t.is(result.message, `The first section must be ${chalk.bold('Contents')}`);
});
