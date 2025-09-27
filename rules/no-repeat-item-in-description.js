import {lintRule} from 'unified-lint-rule';
import {toString} from 'mdast-util-to-string';
import {visit} from 'unist-util-visit';

const WORD_BOUNDARY_PATTERN = /^[\s.,!?:-]/;
const SEPARATOR = ' - ';

const isBadgeLink = (link, nextNode) => {
	const hasImage = link.children?.some(node => node.type === 'image');
	const followedByLink = nextNode?.type === 'link';
	return hasImage || followedByLink;
};

const findMainLink = paragraphChildren => {
	for (const [index, child] of paragraphChildren.entries()) {
		if (child.type !== 'link') {
			continue;
		}

		const nextNonWhitespace = paragraphChildren
			.slice(index + 1)
			.find(node => node.type !== 'text' || node.value.trim());

		if (!isBadgeLink(child, nextNonWhitespace)) {
			return {link: child, index};
		}
	}

	return {link: null, index: -1};
};

const extractDescription = (nodes, separatorIndex) => {
	const separatorNode = nodes[separatorIndex];
	const parts = separatorNode.value.split(SEPARATOR);

	if (parts.length < 2) {
		return '';
	}

	// Get text after separator plus all remaining nodes
	const afterSeparator = parts.slice(1).join(SEPARATOR);
	const remainingText = nodes
		.slice(separatorIndex + 1)
		.map(node => toString(node))
		.join('');

	return (afterSeparator + remainingText).trim();
};

const findSeparatorIndex = nodes => {
	for (const [index, node] of nodes.entries()) {
		if (node.type === 'text' && node.value.includes(SEPARATOR)) {
			return index;
		}

		// Allow formatting nodes before separator
		const isFormatting = ['emphasis', 'strong', 'inlineCode'].includes(node.type);
		const isWhitespace = node.type === 'text' && !node.value.trim();

		if (!isFormatting && !isWhitespace) {
			return -1;
		}
	}

	return -1;
};

const noRepeatItemInDescriptionRule = lintRule('remark-lint:no-repeat-item-in-description', (ast, file) => {
	visit(ast, 'listItem', node => {
		const paragraph = node.children?.find(child => child.type === 'paragraph');
		if (!paragraph?.children) {
			return;
		}

		const {link: mainLink, index: mainLinkIndex} = findMainLink(paragraph.children);
		if (!mainLink) {
			return;
		}

		const itemName = toString(mainLink);
		if (!itemName) {
			return;
		}

		const nodesAfterLink = paragraph.children.slice(mainLinkIndex + 1);
		const separatorIndex = findSeparatorIndex(nodesAfterLink);

		if (separatorIndex === -1) {
			return;
		}

		const description = extractDescription(nodesAfterLink, separatorIndex);
		if (!description) {
			return;
		}

		// Check if description starts with item name (case-insensitive)
		if (description.toLowerCase().startsWith(itemName.toLowerCase())) {
			const afterItemName = description.slice(itemName.length);

			// Check for word boundary to avoid false positives
			if (!afterItemName || WORD_BOUNDARY_PATTERN.test(afterItemName)) {
				file.message(
					`List item description should not start with the item name "${itemName}"`,
					mainLink,
				);
			}
		}
	});
});

export default noRepeatItemInDescriptionRule;
