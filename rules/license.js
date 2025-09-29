import {find} from 'unist-util-find';
import {lintRule} from 'unified-lint-rule';
import {toString} from 'mdast-util-to-string';

const licenseRule = lintRule('remark-lint:awesome-license', (ast, file) => {
	const license = find(ast, node => (
		node.type === 'heading'
		&& (toString(node).toLowerCase() === 'licence' || toString(node).toLowerCase() === 'license')
	));

	if (license) {
		file.message('Forbidden license section found', license);
	}
});

export default licenseRule;
