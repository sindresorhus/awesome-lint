import {test, expect} from 'vitest';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import noCiBadgeRule from '../../rules/no-ci-badge.js';

const config = {
	plugins: [remarkLint, noCiBadgeRule],
};

test('no-ci-badge - missing', async () => {
	const messages = await lint({config, filename: 'test/fixtures/no-ci-badge/0.md'});
	expect(messages).toEqual([
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
