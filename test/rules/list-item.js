import {test, expect} from 'vitest';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import listItemRule from '../../rules/list-item.js';

const config = {
	plugins: [remarkLint, listItemRule],
};

test('list-item - valid', async () => {
	const messages = await lint({config, filename: 'test/fixtures/list-item/0.md'});
	expect(messages).toEqual([]);
});

test('list-item - invalid', async () => {
	const messages = await lint({config, filename: 'test/fixtures/list-item/1.md'});
	expect(messages).toMatchSnapshot();
});

test('list-item - valid ignoring Contents section', async () => {
	const messages = await lint({config, filename: 'test/fixtures/list-item/2.md'});
	expect(messages).toEqual([]);
});

test('list-item - invalid sublist punctuation', async () => {
	const messages = await lint({config, filename: 'test/fixtures/list-item/3.md'});
	expect(messages).toMatchSnapshot();
});

test('list-item - disable, enable, and ignore comments', async () => {
	const messages = await lint({config, filename: 'test/fixtures/list-item/4.md'});
	expect(messages).toMatchSnapshot();
});
