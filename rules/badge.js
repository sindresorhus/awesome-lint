import {lintRule} from 'unified-lint-rule';
import {visit} from 'unist-util-visit';

const badgeUrlAllowList = new Set([
	'https://awesome.re',
	'https://github.com/sindresorhus/awesome',
]);

const badgeSourceUrlAllowList = new Set([
	'https://awesome.re/badge.svg',
	'https://awesome.re/badge-flat.svg',
	'https://awesome.re/badge-flat2.svg',
]);

const isValidBadgeUrl = url => badgeUrlAllowList.has(url);
const isValidBadgeSourceUrl = url => badgeSourceUrlAllowList.has(url);

const badgeRule = lintRule('remark-lint:awesome-badge', (ast, file) => {
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
					if (!isValidBadgeSourceUrl(child2.url)) {
						file.message('Invalid badge source', child2);
						return;
					}

					hasBadge = true;
				}
			}
		}

		if (!hasBadge) {
			file.message('Missing Awesome badge next to the main heading', node);
		}
	});
});

export default badgeRule;
