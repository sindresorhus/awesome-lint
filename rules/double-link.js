import normalizeUrl from 'normalize-url';
import {lintRule} from 'unified-lint-rule';
import {visit} from 'unist-util-visit';

// TODO(sindresorhus): I plan to extract this to a package at some point.

const doubleLinkRule = lintRule('remark-lint:double-link', (ast, file) => {
	const linkNodes = new Map();

	visit(ast, 'link', node => {
		const {url} = node;

		if (typeof url !== 'string') {
			return;
		}

		// Normalize URL for comparison, but preserve hash fragments for uniqueness
		let normalizedUrl;
		if (url.startsWith('#')) {
			// Anchor links - use as-is
			normalizedUrl = url;
		} else {
			// External URLs - normalize but keep hash fragments
			try {
				normalizedUrl = normalizeUrl(url, {
					removeDirectoryIndex: [/^index\.[a-z]+$/],
					stripHash: false, // Keep hash fragments for uniqueness
					stripProtocol: true,
				});
			} catch {
				// If normalization fails, use original URL
				normalizedUrl = url;
			}
		}

		if (linkNodes.has(normalizedUrl)) {
			linkNodes.get(normalizedUrl).push(node);
		} else {
			linkNodes.set(normalizedUrl, [node]);
		}
	});

	for (const nodes of linkNodes.values()) {
		if (nodes.length <= 1) {
			continue;
		}

		for (const node of nodes) {
			file.message(`Duplicate link: ${node.url}`, node);
		}
	}
});

export default doubleLinkRule;
