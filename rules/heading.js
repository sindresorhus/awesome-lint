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

			// Special handling for headings ending with file extensions
			// Common patterns: .js, .ts, .min.js, .test.js, .tar.gz, etc.
			// These should preserve their original case for the extension part
			let expectedTitle = titleCase(headingText);

			// Check if heading ends with what looks like a file extension
			// Match one or more segments starting with dot followed by alphanumerics
			const extensionMatch = headingText.match(/^(.+?)((?:\.[a-z\d]{1,10})+)$/i);

			if (extensionMatch) {
				const [, textBeforeExtension, extension] = extensionMatch;
				// Additional validation: ensure it's not just a decimal number
				// Extensions typically don't start with digits after the first dot
				if (!/^\.\d/.test(extension)) {
					expectedTitle = titleCase(textBeforeExtension) + extension;
				}
			}

			if (!listHeadingCaseAllowList.has(caseOf(headingText)) && expectedTitle !== headingText) {
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
