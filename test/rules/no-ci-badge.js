import test from 'ava';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import noCiBadgeRule from '../../rules/no-ci-badge.js';

const config = {
	plugins: [
		remarkLint,
		noCiBadgeRule,
	],
};

test('no-ci-badge - missing', async t => {
	const messages = await lint({config, filename: 'test/fixtures/no-ci-badge/0.md'});
	t.deepEqual(messages, [
		{
			line: 1,
			ruleId: 'awesome-no-ci-badge',
			message: 'Readme must not contain CI badge',
		},
		{
			line: 3,
			ruleId: 'awesome-no-ci-badge',
			message: 'Readme must not contain CI badge',
		},
	]);
});
