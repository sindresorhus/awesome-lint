import test from 'ava';
import m from '../';

test('badge - missing', async t => {
	const result = (await m({filename: 'fixtures/badge.md'})).messages[0];
	t.is(result.ruleId, 'awesome/badge');
	t.is(result.message, 'Missing Awesome badge after the main heading');
});

test('badge - incorrect source', async t => {
	const result = (await m({filename: 'fixtures/badge2.md'})).messages[0];
	t.is(result.ruleId, 'awesome/badge');
	t.is(result.message, 'Incorrect badge source');
});

process.chdir('package-default');
test.serial('default package - trailing slashes not allowed', async t => {
	const result = (await m({filename: 'fixtures/trailing-slash.md'})).messages[0];
	t.is(result.ruleId, 'awesome/badge');
});

process.chdir('package-no-trailing-slash');
test.serial('package with {"trailing-slash": false} - trailing slashes not allowed', async t => {
	const result = (await m({filename: 'fixtures/trailing-slash.md'})).messages[0];
	t.is(result.ruleId, 'awesome/badge');
});

process.chdir('package-trailing-slash');
test.serial('package with {"trailing-slash": true} - trailing slashes allowed', async t => {
	const result = (await m({filename: 'fixtures/trailing-slash.md'})).messages[0];
	t.is(result.ruleId, 'awesome/badge');
});
