import test from 'ava';
import lint from '../_lint.js';

const config = {
	plugins: [
		require('remark-lint'),
		require('../../rules/no-ci-badge.js')
	]
};

test('no-ci-badge - missing', async t => {
	const messages = await lint({config, filename: 'test/fixtures/no-ci-badge/0.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-no-ci-badge',
			message: 'Readme must not contain CI badge'
		},
		{
			line: 3,
			ruleId: 'awesome-no-ci-badge',
			message: 'Readme must not contain CI badge'
		}
	]);
});
