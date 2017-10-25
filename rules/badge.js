'use strict';
const visit = require('unist-util-visit');

module.exports = (ast, file) => {
	visit(ast, 'heading', (node, index) => {
		if (index > 0) {
			return;
		}

		const badgeUrl = 'https://awesome.re';
		const badgeSrcUrl = 'https://awesome.re/badge.svg';

		let hasBadge = false;

		for (const child of node.children) {
			if (node.depth === 1 && child.type === 'link' && child.url === badgeUrl) {
				for (const child2 of child.children) {
					if (child2.type === 'image') {
						if (child2.url !== badgeSrcUrl) {
							file.warn('Incorrect badge source', child2);
							return;
						}

						hasBadge = true;
					}
				}
			}
		}

		if (!hasBadge) {
			file.warn('Missing Awesome badge after the main heading', node);
		}
	});
};
