import {find} from 'unist-util-find';
import {lintRule} from 'unified-lint-rule';
import findAuthorName from '../lib/find-author-name.js';

const authorName = 'sindresorhus';
const authorEmail = 'sindresorhus@gmail.com';

const codeOfConductRule = lintRule('remark-lint:awesome-code-of-conduct', (ast, file) => {
	if (ast.children.length === 0) {
		file.message('code-of-conduct.md file must not be empty', ast);
		return;
	}

	const placeholder = find(ast, node => (
		node.type === 'linkReference'
		&& node.label === 'INSERT EMAIL ADDRESS'
	));
	if (placeholder) {
		file.message('The email placeholder must be replaced with yours', placeholder);
		return;
	}

	if (findAuthorName(file) !== authorName) {
		const email = find(ast, node => (
			node.type === 'text'
			&& node.value.includes(authorEmail)
		));
		if (email) {
			file.message('The default email must be replaced with yours', email);
		}
	}
});

export default codeOfConductRule;
