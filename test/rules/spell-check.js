import {test, expect} from 'vitest';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import spellCheckRule from '../../rules/spell-check.js';

const config = {
	plugins: [remarkLint, spellCheckRule],
};

test('spell-check - success', async () => {
	const messages = await lint({config, filename: 'test/fixtures/spell-check/success0.md'});
	expect(messages).toEqual([]);
});

test('spell-check - error', async () => {
	const messages = await lint({config, filename: 'test/fixtures/spell-check/error0.md'});
	expect(messages).toMatchSnapshot();
});
