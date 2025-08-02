import {test, expect} from 'vitest';
import lint from '../_lint.js';

const config = {
	plugins: [
		// Don't set here, because it is only plugins for readme.md
		// require('../../rules/code-of-conduct')
	],
};

test('code-of-conduct - invalid if empty', async () => {
	const messages = await lint({config, filename: 'test/fixtures/code-of-conduct/error0/readme.md'});
	expect(messages).toEqual([
		{
			line: undefined,
			ruleId: 'awesome-code-of-conduct',
			message: 'code-of-conduct.md file must not be empty',
		},
	]);
});

test.fails('code-of-conduct - invalid if has placeholder', async () => {
	const messages = await lint({config, filename: 'test/fixtures/code-of-conduct/error1/readme.md'});
	expect(messages).toEqual([
		{
			line: 58,
			ruleId: 'awesome-code-of-conduct',
			message: 'The email placeholder must be replaced with yours',
		},
	]);
});

test.fails('code-of-conduct - invalid if just copied', async () => {
	const messages = await lint({config, filename: 'test/fixtures/code-of-conduct/error2/readme.md'});
	expect(messages).toEqual([
		{
			line: 58,
			ruleId: 'awesome-code-of-conduct',
			message: 'The default email must be replaced with yours',
		},
	]);
});

test('code-of-conduct - valid if missing', async () => {
	const messages = await lint({config, filename: 'test/fixtures/code-of-conduct/valid0/readme.md'});
	expect(messages).toEqual([]);
});

test('code-of-conduct - valid if replaced', async () => {
	const messages = await lint({config, filename: 'test/fixtures/code-of-conduct/valid1/readme.md'});
	expect(messages).toEqual([]);
});

test('code-of-conduct - valid if is sindresorhus himself', async () => {
	const messages = await lint({config, filename: 'test/fixtures/code-of-conduct/valid2/readme.md'});
	expect(messages).toEqual([]);
});

test('code-of-conduct - valid with another file name', async () => {
	const messages = await lint({config, filename: 'test/fixtures/code-of-conduct/valid3/readme.md'});
	expect(messages).toEqual([]);
});

test('code-of-conduct - valid with another folder', async () => {
	const messages = await lint({config, filename: 'test/fixtures/code-of-conduct/valid4/readme.md'});
	expect(messages).toEqual([]);
});
