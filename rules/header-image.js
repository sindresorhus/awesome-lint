import fs from 'node:fs';
import path from 'node:path';
import {lintRule} from 'unified-lint-rule';
import {visit} from 'unist-util-visit';

const badgeSourcePatterns = new Set([
	'https://awesome.re/badge.svg',
	'https://awesome.re/badge-flat.svg',
	'https://awesome.re/badge-flat2.svg',
]);

const isBadge = url => {
	if (!url || typeof url !== 'string') {
		return false;
	}

	if (badgeSourcePatterns.has(url)) {
		return true;
	}

	return url.includes('shields.io') || url.includes('badge');
};

const isSvg = url => url.toLowerCase().split('?')[0].split('#')[0].endsWith('.svg');

const hasHiDpiMarker = url => {
	const clean = url.toLowerCase().split('?')[0].split('#')[0];
	return /@[23]x[./]/.test(clean) || /[_-][23]x\./.test(clean);
};

function readImageSize(filePath) {
	let buffer;
	try {
		buffer = fs.readFileSync(filePath);
	} catch {
		return undefined;
	}

	// PNG: bytes 1-3 are 'PNG', dimensions at offset 16
	if (buffer.length >= 24 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
		return {
			width: buffer.readUInt32BE(16),
			height: buffer.readUInt32BE(20),
		};
	}

	// JPEG: starts with FF D8, scan for SOF0 (C0) or SOF2 (C2)
	if (buffer.length >= 4 && buffer[0] === 0xFF && buffer[1] === 0xD8) {
		let offset = 2;
		while (offset + 4 < buffer.length) {
			if (buffer[offset] !== 0xFF) {
				break;
			}

			const marker = buffer[offset + 1];

			if (marker === 0xD9 || marker === 0xDA) {
				break;
			}

			const segmentLength = buffer.readUInt16BE(offset + 2);
			if (segmentLength < 2) {
				break;
			}

			if ((marker === 0xC0 || marker === 0xC2) && offset + 9 < buffer.length) {
				return {
					width: buffer.readUInt16BE(offset + 7),
					height: buffer.readUInt16BE(offset + 5),
				};
			}

			offset += 2 + segmentLength;
		}
	}

	return undefined;
}

function extractHtmlImages(html) {
	const images = [];
	for (const match of html.matchAll(/<img\s+[^>]*>/gi)) {
		const tag = match[0];
		const src = /src\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
		const displayWidth = Number.parseInt(/width\s*=\s*["']?(\d+)["']?/i.exec(tag)?.[1], 10);
		const displayHeight = Number.parseInt(/height\s*=\s*["']?(\d+)["']?/i.exec(tag)?.[1], 10);
		if (src) {
			images.push({
				url: src,
				displayWidth: Number.isFinite(displayWidth) ? displayWidth : undefined,
				displayHeight: Number.isFinite(displayHeight) ? displayHeight : undefined,
			});
		}
	}

	return images;
}

function findHeaderImages(ast) {
	const images = [];

	// Pattern 1: HTML blocks at the top (before any non-HTML content)
	if (Array.isArray(ast.children)) {
		for (const child of ast.children) {
			if (child.type !== 'html') {
				break;
			}

			images.push(...extractHtmlImages(child.value));
		}

		if (images.length > 0) {
			return images.filter(image => !isBadge(image.url));
		}
	}

	// Pattern 2: Images inside the first H1 heading
	visit(ast, 'heading', node => {
		if (node.depth !== 1) {
			return visit.EXIT;
		}

		for (const child of node.children) {
			if (child.type === 'image') {
				images.push({url: child.url});
			}

			if (child.type === 'link') {
				for (const grandchild of child.children ?? []) {
					if (grandchild.type === 'image') {
						images.push({url: grandchild.url});
					}
				}
			}
		}

		return visit.EXIT;
	});

	return images.filter(image => !isBadge(image.url));
}

function isHighQualityImage({url, displayWidth, displayHeight, cwd}) {
	if (isSvg(url)) {
		return true;
	}

	if (hasHiDpiMarker(url)) {
		return true;
	}

	// For local files with explicit display dimensions, verify 2x pixel ratio
	if (typeof displayWidth === 'number' && typeof displayHeight === 'number' && !url.startsWith('http')) {
		const filePath = path.resolve(cwd, url);
		const size = readImageSize(filePath);
		if (size && size.width >= displayWidth * 2 && size.height >= displayHeight * 2) {
			return true;
		}
	}

	return false;
}

const headerImageRule = lintRule('remark-lint:awesome-header-image', (ast, file) => {
	const headerImages = findHeaderImages(ast);

	if (headerImages.length === 0) {
		return;
	}

	const cwd = file.path ? path.dirname(file.path) : file.cwd;

	for (const image of headerImages) {
		if (!isHighQualityImage({...image, cwd})) {
			file.message(
				'Header image must be SVG or high-DPI (at least 2× pixel dimensions or @2x filename)',
				ast,
			);
			return;
		}
	}
});

export default headerImageRule;
