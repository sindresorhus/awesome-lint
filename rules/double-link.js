import normalizeUrl from 'normalize-url';
import {lintRule} from 'unified-lint-rule';
import {visit} from 'unist-util-visit';

// TODO(sindresorhus): I plan to extract this to a package at some point.

// Helper function for awesome-list use case
export const createAwesomeListIgnore = ast => {
	const descriptionLinks = new Set();

	// Identify links in list item descriptions (to be ignored)
	visit(ast, 'listItem', listItem => {
		const [paragraph] = listItem.children;
		if (!paragraph || paragraph.type !== 'paragraph' || paragraph.children.length === 0) {
			return;
		}

		let mainLinkFound = false;

		for (let index = 0; index < paragraph.children.length; index++) {
			const child = paragraph.children[index];

			if (child.type !== 'link' && child.type !== 'linkReference') {
				continue;
			}

			if (!mainLinkFound) {
				// Check if this is the main link (followed by ' - ')
				const next = paragraph.children[index + 1];
				if (next?.type === 'text' && next.value?.startsWith(' - ')) {
					mainLinkFound = true;
					continue; // This is main link, don't ignore
				}

				// If it's the first link/linkReference, treat as main
				const hasPriorLink = paragraph.children.slice(0, index).some(node =>
					node.type === 'link' || node.type === 'linkReference');
				if (!hasPriorLink) {
					mainLinkFound = true;
					continue; // This is main link, don't ignore
				}
			}

			// This is a description link - only mark actual 'link' nodes (not linkReference)
			if (child.type === 'link') {
				descriptionLinks.add(child);
			}
		}
	});

	return node => descriptionLinks.has(node);
};

const doubleLinkRule = lintRule('remark-lint:double-link', (ast, file, options = {}) => {
	const linkNodes = new Map();
	const {ignore: ignoreUrls = [], shouldIgnore: shouldIgnoreFactory} = options;

	// Create shouldIgnore function if factory provided
	const shouldIgnore = shouldIgnoreFactory?.(ast);

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

	// Check all links for duplicates
	visit(ast, 'link', node => {
		// Custom ignore hook
		if (shouldIgnore?.(node)) {
			return;
		}

		const {url} = node;
		if (typeof url !== 'string') {
			return;
		}

		const normalizedUrl = normalizeUrlSafely(url);

		// Check if this URL should be ignored
		const shouldIgnoreUrl = ignoreUrls.some(ignoreUrl => {
			try {
				const normalizedIgnoreUrl = normalizeUrl(ignoreUrl, normalizeUrlOptions);
				return normalizedUrl === normalizedIgnoreUrl;
			} catch {
				return url === ignoreUrl;
			}
		});

		if (shouldIgnoreUrl) {
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
