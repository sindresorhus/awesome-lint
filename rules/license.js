'use strict';
const find = require('unist-util-find');
const findAllAfter = require('unist-util-find-all-after');
const rule = require('unified-lint-rule');
const toString = require('mdast-util-to-string');

module.exports = rule('remark-lint:awesome/license', (ast, file) => {
	const license = find(ast, node => (
		node.type === 'heading' &&
		toString(node) === 'License'
	));

	if (!license) {
		file.message('Missing License section', ast);
		return;
	}

	if (license.depth !== 2) {
		file.message('License section must be at heading depth 2', ast);
		return;
	}

	const headingsPost = findAllAfter(ast, license, {
		type: 'heading',
		depth: 2
	});

	if (headingsPost.length > 0) {
		file.message('License must be the last section', headingsPost[0]);
		return;
	}

	const children = findAllAfter(ast, license, () => true);
	const content = toString({type: 'root', children});

	if (!content) {
		file.message('License must not be empty', license);
	}
});
