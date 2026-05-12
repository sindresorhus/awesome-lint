import fs from 'node:fs';
import path from 'node:path';
import {lintRule} from 'unified-lint-rule';
import {isValidBadgeSourceUrl, isValidBadgeUrl} from './badge.js';

const message = 'Header image must be SVG or high-DPI';
const imageTagPattern = /<img\b[^>]*>/gi;
const highDpiFilenamePattern = /(?:^|[.@_-])[234]x(?:[._-]|$)/i;
const nonStartOfFrameJpegMarkers = new Set([0xC4, 0xC8, 0xCC]);

const headerImageRule = lintRule('remark-lint:awesome-header-image', (ast, file) => {
	for (const image of findHeaderImages(ast)) {
		if (isAwesomeBadgeImage(image) || isValidHeaderImage(image, file)) {
			continue;
		}

		file.message(message, image.node);
	}
});

function findHeaderImages(ast) {
	const images = [];
	const children = ast.children ?? [];
	const headingIndex = children.findIndex(node => node.type === 'heading' && node.depth === 1);

	if (headingIndex === -1) {
		const firstNode = children.find(node => !isBlankHtmlNode(node));

		if (firstNode?.type === 'html') {
			addFirstHtmlImage(images, firstNode);
		}

		return images;
	}

	for (let index = 0; index < headingIndex; index++) {
		const node = children[index];

		if (node.type === 'html') {
			addFirstHtmlImage(images, node);
			continue;
		}

		if (!isBlankHtmlNode(node)) {
			break;
		}
	}

	findMarkdownImages(children[headingIndex], images);

	const nextNode = findNextSignificantNode(children, headingIndex + 1);

	if (nextNode?.type === 'html') {
		addFirstHtmlImage(images, nextNode);
	} else if (isImageOnlyParagraph(nextNode)) {
		findMarkdownImages(nextNode, images);
	}

	return images;
}

function findNextSignificantNode(nodes, startIndex) {
	for (let index = startIndex; index < nodes.length; index++) {
		const node = nodes[index];

		if (!isBlankHtmlNode(node)) {
			return node;
		}
	}
}

function isBlankHtmlNode(node) {
	return node?.type === 'html' && node.value.trim() === '';
}

function isImageOnlyParagraph(node) {
	if (node?.type !== 'paragraph') {
		return false;
	}

	return node.children.every(child => {
		if (child.type === 'image') {
			return true;
		}

		if (child.type === 'link') {
			return child.children.every(linkChild => linkChild.type === 'image');
		}

		return child.type === 'text' && child.value.trim() === '';
	});
}

function addFirstHtmlImage(images, node) {
	const image = findHtmlImages(node).find(image => !isAwesomeBadgeImage(image));

	if (image) {
		images.push(image);
	}
}

function findMarkdownImages(node, images, linkUrl) {
	if (node.type === 'image') {
		images.push({
			node,
			url: node.url,
			linkUrl,
		});

		return;
	}

	for (const child of node.children ?? []) {
		findMarkdownImages(child, images, node.type === 'link' ? node.url : linkUrl);
	}
}

function findHtmlImages(node) {
	const images = [];

	for (const match of node.value.matchAll(imageTagPattern)) {
		const attributes = parseAttributes(match[0]);
		const url = attributes.get('src');

		if (!url) {
			continue;
		}

		images.push({
			node,
			url,
			width: parseDisplaySize(attributes.get('width')),
			height: parseDisplaySize(attributes.get('height')),
		});
	}

	return images;
}

function parseAttributes(tag) {
	const attributes = new Map();
	const source = tag
		.replace(/^<\s*img\b/i, '')
		.replace(/\/?\s*>$/i, '');
	const attributePattern = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

	for (const match of source.matchAll(attributePattern)) {
		attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '');
	}

	return attributes;
}

function parseDisplaySize(value) {
	const match = value?.trim().match(/^(\d+(?:\.\d+)?)\s*(?:px)?$/i);
	return match ? Number(match[1]) : undefined;
}

function isAwesomeBadgeImage(image) {
	return isValidBadgeSourceUrl(image.url) || isValidBadgeUrl(image.linkUrl);
}

function isValidHeaderImage(image, file) {
	if (isSvg(image.url)) {
		return true;
	}

	const dimensions = getLocalImageDimensions(file, image.url);
	const hasDisplaySize = Boolean(image.width ?? image.height);

	if (dimensions && hasDisplaySize) {
		return isHighDpi({
			displayWidth: image.width,
			displayHeight: image.height,
			intrinsicWidth: dimensions.width,
			intrinsicHeight: dimensions.height,
		});
	}

	return highDpiFilenamePattern.test(getUrlPathname(image.url));
}

function isSvg(url) {
	const pathname = getUrlPathname(url).toLowerCase();
	return pathname.endsWith('.svg') || pathname.endsWith('.svgz') || url.toLowerCase().startsWith('data:image/svg+xml');
}

function isHighDpi({displayWidth, displayHeight, intrinsicWidth, intrinsicHeight}) {
	if (displayWidth && intrinsicWidth < displayWidth * 2) {
		return false;
	}

	if (displayHeight && intrinsicHeight < displayHeight * 2) {
		return false;
	}

	return true;
}

function getLocalImageDimensions(file, url) {
	const pathname = getUrlPathname(url);

	if (!pathname || /^[a-z][a-z\d+.-]*:/i.test(pathname) || path.isAbsolute(pathname)) {
		return;
	}

	const directory = file.dirname ?? (file.path ? path.dirname(file.path) : undefined);

	if (!directory) {
		return;
	}

	try {
		return getImageDimensions(fs.readFileSync(path.resolve(directory, decodeURIComponent(pathname))));
	} catch {}
}

function getUrlPathname(url) {
	return url.split(/[?#]/, 1)[0];
}

function getImageDimensions(buffer) {
	return getPngDimensions(buffer) ?? getJpegDimensions(buffer) ?? getGifDimensions(buffer);
}

function getPngDimensions(buffer) {
	if (
		buffer.length < 24
		|| buffer[0] !== 0x89
		|| buffer.toString('ascii', 1, 4) !== 'PNG'
	) {
		return;
	}

	return {
		width: buffer.readUInt32BE(16),
		height: buffer.readUInt32BE(20),
	};
}

function getJpegDimensions(buffer) {
	if (buffer.length < 4 || buffer[0] !== 0xFF || buffer[1] !== 0xD8) {
		return;
	}

	let offset = 2;

	while (offset < buffer.length) {
		if (buffer[offset] !== 0xFF) {
			return;
		}

		const marker = buffer[offset + 1];
		offset += 2;

		if (marker === 0xDA || marker === 0xD9 || offset + 2 > buffer.length) {
			return;
		}

		const length = buffer.readUInt16BE(offset);

		if (length < 2 || offset + length > buffer.length) {
			return;
		}

		if (isJpegStartOfFrame(marker)) {
			return {
				height: buffer.readUInt16BE(offset + 3),
				width: buffer.readUInt16BE(offset + 5),
			};
		}

		offset += length;
	}
}

function isJpegStartOfFrame(marker) {
	return marker >= 0xC0 && marker <= 0xCF && !nonStartOfFrameJpegMarkers.has(marker);
}

function getGifDimensions(buffer) {
	if (buffer.length < 10 || !['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))) {
		return;
	}

	return {
		width: buffer.readUInt16LE(6),
		height: buffer.readUInt16LE(8),
	};
}

export default headerImageRule;
