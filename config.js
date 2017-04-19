'use strict';
const path = require('path');

// Rules per remark-lint 4.0.2

module.exports = {
	reset: true,
	'blockquote-indentation': 2,
	'checkbox-character-style': {
		checked: 'x',
		unchecked: ' '
	},
	'checkbox-content-indent': true,
	'code-block-style': 'fenced',
	'definition-case': true,
	'definition-spacing': true,
	'emphasis-marker': '*',
	'fenced-code-marker': '`',
	'file-extension': true,
	'final-newline': true,
	// TODO: because of https://github.com/wooorm/remark-lint/issues/77
	// 'first-heading-level': 1,
	'hard-break-spaces': true,
	'heading-style': 'atx',
	'link-title-style': '\'',
	'list-item-bullet-indent': true,
	'list-item-content-indent': true,
	'list-item-indent': 'space',
	// TODO: because of https://github.com/wooorm/remark-lint/issues/78
	// 'list-item-spacing': true,
	'no-auto-link-without-protocol': true,
	'no-blockquote-without-caret': true,
	'no-duplicate-definitions': true,
	// TODO: because of https://github.com/wooorm/remark-lint/issues/84
	// 'no-duplicate-headings': true,
	'no-emphasis-as-heading': true,
	'no-file-name-articles': true,
	'no-file-name-consecutive-dashes': true,
	'no-file-name-irregular-characters': true,
	'no-file-name-mixed-case': true,
	'no-file-name-outer-dashes': true,
	'no-heading-content-indent': true,
	'no-heading-indent': true,
	'no-heading-punctuation': true,
	'no-inline-padding': true,
	'no-literal-urls': true,
	// TODO: because of https://github.com/wooorm/remark-lint/issues/79
	// 'no-missing-blank-lines': true,
	'no-multiple-toplevel-headings': 1,
	'no-shell-dollars': true,
	'no-table-indentation': true,
	'no-undefined-references': true,
	'no-unused-definitions': true,
	'ordered-list-marker-style': '.',
	'ordered-list-marker-value': 'ordered',
	'rule-style': '---',
	'strong-marker': '*',
	'table-cell-padding': 'padded',
	'table-pipe-alignment': true,
	'table-pipes': true,
	'unordered-list-marker-style': '-',

	// Plugins
	external: [
		'remark-lint-no-empty-sections',
		'remark-lint-no-url-trailing-slash',
		// 'remark-lint-are-links-valid',
		path.join(__dirname, 'rules')
	],
	'empty-sections': true,
	'trailing-slash': true,
	// This rule is a good idea, but in reality it's way too slow and has too many false positives
	// 'are-links-valid': {
	// 	// TODO: The error message is too unclear here. Make a rule that disallows redirects
	// 	// allowRedirects: false,
	// 	timeout: 2000
	// },
	'awesome/badge': true,
	'awesome/list-item': true
};
