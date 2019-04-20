'use strict';
const find = require('unist-util-find');
const rule = require('unified-lint-rule');
const findAuthorName = require('../lib/find-author-name');

const authorName = 'sindresorhus';
const authorEmail = 'sindresorhus@gmail.com';

module.exports = rule('remark-lint:awesome/code-of-conduct', (ast, file) => {
	const placeholder = find(ast, node => (
		node.type === 'linkReference' &&
		node.label === 'INSERT EMAIL ADDRESS'
	));
	if (placeholder) {
		file.message('Email placeholder must be replaced with yours', placeholder);
		return;
	}

	if (findAuthorName(file) !== authorName) {
		const email = find(ast, node => (
			node.type === 'text' &&
			node.value.indexOf(authorEmail) >= 0
		));
		if (email) {
			file.message('Default email must be replaced with yours', email);
		}
	}
});
