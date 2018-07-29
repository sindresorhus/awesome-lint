'use strict';
const find = require('unist-util-find');
const findAllAfter = require('unist-util-find-all-after');
const findAllBefore = require('unist-util-find-all-before');
const findAllBetween = require('unist-util-find-all-between');
const rule = require('unified-lint-rule');
const GitHubSlugger = require('github-slugger');
const toString = require('mdast-util-to-string');
const visit = require('unist-util-visit');

const slugger = new GitHubSlugger();

const maxListItemDepth = 1;

module.exports = rule('remark-lint:awesome/toc', (ast, file) => {
	slugger.reset();

	const headingLinks = buildHeadingLinks(ast);

	const toc = find(ast, node => (
		node.type === 'heading' &&
		node.depth === 2 &&
		toString(node).trim() === 'Contents'
	));

	if (!toc) {
		file.message('Missing or invalid Table of Contents', ast);
		return;
	}

	const headingsPre = findAllBefore(ast, toc, {
		type: 'heading'
	});

	if (headingsPre.length > 1) {
		file.message('Table of Contents must be the first section', toc);
	} else if (headingsPre.length === 0) {
		file.message('First heading should be name of awesome list', toc);
	}

	const headingsPost = findAllAfter(ast, toc, {
		type: 'heading',
		depth: 2
	}).filter(node => toString(node) !== 'License');

	if (headingsPost.length === 0) {
		file.message('Missing content headers', ast);
		return;
	}

	const tocLists = findAllBetween(ast, toc, headingsPost[0], 'list');

	if (tocLists.length === 0) {
		file.message('Missing or invalid Table of Contents list', toc);
	} else if (tocLists.length > 1) {
		file.message('Multiple Table of Contents lists found', toc);
	} else {
		const tocList = tocLists[0];

		// Validate list items recursively
		validateListItems({
			ast,
			file,
			list: tocList,
			headingLinks,
			headings: headingsPost,
			depth: 0
		});
	}
});

function buildHeadingLinks(ast) {
	const links = {};

	visit(ast, 'heading', node => {
		const text = toString(node);
		const slug = slugger.slug(text);
		const link = `#${slug}`;

		links[link] = node;
	});

	return links;
}

function validateListItems({ast, file, list, headingLinks, headings, depth}) {
	let index = 0;

	if (list) {
		for (; index < list.children.length; ++index) {
			const listItem = list.children[index];
			const link = find(listItem, n => n.type === 'link');

			if (!link) {
				file.message(`ToC item "${index}" missing link "${toString(listItem)}"`, listItem);
				return;
			}

			const {url} = link;
			const text = toString(link);
			const heading = headings[index];
			const headingText = heading && toString(heading);

			if (!text) {
				file.message(`ToC item "${url}" missing link text`, listItem);
				return;
			}

			if (!headingText) {
				file.message(`ToC item "${text}" missing corresponding heading`, listItem);
				return;
			}

			if (text !== headingText) {
				file.message(`ToC item "${text}" does not match corresponding heading "${headingText}"`, listItem);
				return;
			}

			const headingLink = headingLinks[url];

			if (headingLink) {
				headingLinks[url] = false;
			} else if (headingLink === undefined) {
				file.message(`ToC item "${text}" link "${url}" not found`, listItem);
				return;
			} else {
				file.message(`ToC item "${text}" has duplicate link "${url}"`, listItem);
				return;
			}

			const subList = find(listItem, n => n.type === 'list');

			if (subList) {
				if (depth < maxListItemDepth) {
					const nextHeading = headings[index + 1];
					const subHeadings = nextHeading ? findAllBetween(ast, heading, nextHeading, {
						type: 'heading',
						depth: depth + 3
					}) : findAllAfter(ast, heading, {
						type: 'heading',
						depth: depth + 3
					});

					validateListItems({
						ast,
						file,
						list: subList,
						headingLinks,
						headings: subHeadings,
						depth: depth + 1
					});
				} else {
					file.message(`Exceeded max depth of ${maxListItemDepth + 1} levels`);
				}
			}
		}
	}

	if (index < headings.length) {
		for (let i = index; i < headings.length; ++i) {
			const heading = headings[i];
			file.message(`ToC missing item for "${toString(heading)}"`, list);
		}
	}
}
