'use strict';
const caseOf = require('case').of;
const find = require('unist-util-find');
const findAllAfter = require('unist-util-find-all-after');
const isUrl = require('is-url-superb');
const rule = require('unified-lint-rule');
const toString = require('mdast-util-to-string');
const visit = require('unist-util-visit');

// Valid casings for first text word in list item descriptions
const listItemPrefixCaseWhitelist = new Set([
	'camel',
	'capital',
	'constant',
	'pascal'
]);

// Valid node types in list item descriptions
const listItemDescriptionNodeWhitelist = new Set([
	'emphasis',
	'footnoteReference',
	'inlineCode',
	'link',
	'linkReference',
	'strong',
	'text'
]);

module.exports = rule('remark-lint:awesome/list-item', (ast, file) => {
	const toc = find(ast, node => (
		node.type === 'heading' &&
		node.depth === 2 &&
		toString(node) === 'Contents'
	));

	const lists = toc ? (
		findAllAfter(ast, toc, {type: 'list'})
	) : (
		findAllLists(ast)
	);

	for (const list of lists) {
		validateList(list, file);
	}
});

function findAllLists(ast) {
	const lists = [];
	visit(ast, 'list', list => {
		lists.push(list);
	});
	return lists;
}

function validateList(list, file) {
	for (const listItem of list.children) {
		const [paragraph] = listItem.children;

		if (!paragraph || paragraph.type !== 'paragraph' || paragraph.children.length < 2) {
			file.message('Invalid list item', paragraph);
			continue;
		}

		const [link, ...content] = paragraph.children;

		if (link.type !== 'link' || link.children.length !== 1) {
			file.message('Invalid list item link', link);
			continue;
		}

		if (!isUrl(link.url)) {
			file.message('Invalid list item link URL', link);
			continue;
		}

		const [linkText] = link.children;
		if (!linkText) {
			file.message('Invalid list item link text', link);
			continue;
		}

		validateListItemDescription(content, file);
	}
}

function validateListItemDescription(content, file) {
	const prefix = content[0];
	const suffix = content[content.length - 1];

	// Ensure description starts with a dash separator
	if (prefix.type !== 'text' || !prefix.value.startsWith(' - ')) {
		file.message('List item link and description must be separated with a dash', prefix);
		return false;
	}

	// Ensure description ends with '.' or '!'
	if (suffix.type !== 'text' || !/[.!]$/.test(suffix.value)) {
		file.message('List item description must end with proper punctuation', suffix);
		return false;
	}

	if (prefix === suffix) {
		// Description contains pure text
		if (!validateListItemPrefixCasing(prefix, file)) {
			return false;
		}
	} else {
		// Description contains mixed node types
		for (const node of content) {
			if (!listItemDescriptionNodeWhitelist.has(node.type)) {
				file.message('List item description contains invalid markdown', node);
				return false;
			}
		}

		if (prefix.length > 3 && !validateListItemPrefixCasing(prefix, file)) {
			return false;
		}
	}

	return true;
}

function validateListItemPrefixCasing(prefix, file) {
	const strippedPrefix = prefix.value.slice(3);
	const [firstWord] = strippedPrefix.split(' ');

	if (!firstWord) {
		file.message('List item description must start with a non-empty string', prefix);
		return false;
	}

	if (!listItemPrefixCaseWhitelist.has(caseOf(firstWord))) {
		file.message('List item description must start with valid casing', prefix);
		return false;
	}

	return true;
}
