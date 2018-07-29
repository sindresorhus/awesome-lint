import test from 'ava';
import m from '..';

const config = {
	plugins: [
		require('remark-lint'),
		// TODO: remark-lint-no-empty-sections doesn't handle empty last section
		// https://github.com/vhf/remark-lint-no-empty-sections/issues/3
		require('remark-lint-no-empty-sections'),
		require('../rules/license')
	]
};

test('license - missing', async t => {
	const result = (await m({config, filename: 'test/fixtures/license-error-0.md'})).messages[0];
	t.is(result.ruleId, 'awesome/license');
	t.is(result.message, 'Missing License section');
});

test('license - empty', async t => {
	const result = (await m({config, filename: 'test/fixtures/license-error-1.md'})).messages[0];
	t.is(result.ruleId, 'awesome/license');
	t.is(result.message, 'License must not be empty');
});

test('license - not last section', async t => {
	const result = (await m({config, filename: 'test/fixtures/license-error-2.md'})).messages[0];
	t.is(result.ruleId, 'awesome/license');
	t.is(result.message, 'License must be the last section');
});

test('license - success', async t => {
	const {messages} = (await m({config, filename: 'test/fixtures/license-success-0.md'}));
	t.falsy(messages.find(message => message.ruleId === 'awesome/license'));
});
