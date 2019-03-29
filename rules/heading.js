'use strict';
const rule = require('unified-lint-rule');
const visit = require('unist-util-visit');
const titleCase = require('to-title-case');

module.exports = rule('remark-lint:awesome/heading', (ast, file) => {
	let headings = 0;

	visit(ast, node => {
		if (node.type !== 'heading' || node.depth !== 1) {
			return;
		}

		for (const child of node.children) {
			if (child.type !== 'text') {
				continue;
			}

			const headingText = child.value;

			if (headingText !== titleCase(headingText)) {
				file.message('List heading must be in title case', node);
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
