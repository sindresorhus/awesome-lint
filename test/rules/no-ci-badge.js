import test from 'ava';
import m from '../_lint';

const config = {
	plugins: [
		require('remark-lint'),
		require('../../rules/no-ci-badge')
	]
};

test('no-ci-badge - missing', async t => {
	const messages = await m({config, filename: 'test/fixtures/no-ci-badge/0.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/no-ci-badge',
			message: 'Readme must not contain CI badge'
		},
		{
			ruleId: 'awesome/no-ci-badge',
			message: 'Readme must not contain CI badge'
		}
	]);
});
