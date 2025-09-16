import normalizeUrl from 'normalize-url';
import {lintRule} from 'unified-lint-rule';
import {visit} from 'unist-util-visit';

// TODO(sindresorhus): I plan to extract this to a package at some point.

const doubleLinkRule = lintRule('remark-lint:double-link', (ast, file, options = {}) => {
	const linkNodes = new Map();
	const ignoreUrls = options.ignore || [];

	const normalizeUrlOptions = {
		removeDirectoryIndex: [/^index\.[a-z]+$/],
		stripHash: false, // Keep hash fragments for uniqueness
		stripProtocol: true,
	};

	const normalizeUrlSafely = url => {
		if (url.startsWith('#')) {
			// Anchor links - use as-is
			return url;
		}

		try {
			return normalizeUrl(url, normalizeUrlOptions);
		} catch {
			// If normalization fails, use original URL
			return url;
		}
	};

	visit(ast, 'link', node => {
		const {url} = node;

		if (typeof url !== 'string') {
			return;
		}

		const normalizedUrl = normalizeUrlSafely(url);

		// Check if this URL should be ignored
		const shouldIgnore = ignoreUrls.some(ignoreUrl => {
			try {
				const normalizedIgnoreUrl = normalizeUrl(ignoreUrl, normalizeUrlOptions);
				return normalizedUrl === normalizedIgnoreUrl;
			} catch {
				return url === ignoreUrl;
			}
		});

		if (shouldIgnore) {
			return;
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
