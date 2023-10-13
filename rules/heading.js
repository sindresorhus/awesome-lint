import {lintRule} from 'unified-lint-rule';
import {visit} from 'unist-util-visit';
import case_ from 'case';

const {of: caseOf, title: titleCase} = case_;

const listHeadingCaseAllowList = new Set([
	'title',
	'capital',
]);

const headingRule = lintRule('remark-lint:awesome-heading', (ast, file) => {
	let headings = 0;

	visit(ast, (node, index) => {
		if (node.type !== 'heading') {
			return;
		}

		if (node.depth > 1) {
			if (index !== 0) {
				return;
			}

			file.message('Main list heading must be of depth 1', node);
		}

		for (const child of node.children) {
			if (child.type !== 'text') {
				continue;
			}

			const headingText = child.value;

			if (!listHeadingCaseAllowList.has(caseOf(headingText)) && titleCase(headingText) !== headingText) {
				file.message('Main heading must be in title case', node);
			}
		}

		headings++;

		if (headings > 1) {
			file.message('List can only have one heading', node);
		}
	});

	if (headings === 0) {
		file.message('Missing main list heading');
	}
});

export default headingRule;
