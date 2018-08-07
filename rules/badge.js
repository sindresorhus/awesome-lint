'use strict';
const rule = require('unified-lint-rule');
const visit = require('unist-util-visit');

const badgeUrlWhitelist = new Set([
	'https://awesome.re',
	'https://github.com/sindresorhus/awesome'
]);

const badgeSrcUrlWhitelist = new Set([
	'https://awesome.re/badge.svg',
	'https://awesome.re/badge-flat.svg'
]);

module.exports = rule('remark-lint:awesome/badge', (ast, file) => {
	visit(ast, 'heading', (node, index) => {
		if (index > 0) {
			return;
		}

		let hasBadge = false;

		for (const child of node.children) {
			if (node.depth !== 1 || child.type !== 'link' || !isValidBadgeUrl(child.url)) {
				continue;
			}

			for (const child2 of child.children) {
				if (child2.type === 'image') {
					if (!isValidBadgeSrcUrl(child2.url)) {
						file.message('Invalid badge source', child2);
						return;
					}

					hasBadge = true;
				}
			}
		}

		if (!hasBadge) {
			file.message('Missing Awesome badge after the main heading', node);
		}
	});
});

function isValidBadgeUrl(url) {
	return badgeUrlWhitelist.has(url);
}

function isValidBadgeSrcUrl(url) {
	return badgeSrcUrlWhitelist.has(url);
}
