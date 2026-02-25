import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {lintRule} from 'unified-lint-rule';
import {visit} from 'unist-util-visit';

const BADGE_SOURCE_ALLOW_LIST = new Set([
	'https://awesome.re/badge.svg',
	'https://awesome.re/badge-flat.svg',
	'https://awesome.re/badge-flat2.svg',
]);

const isProbablyBadge = url => {
	if (!url || typeof url !== 'string') {
		return false;
	}

	if (BADGE_SOURCE_ALLOW_LIST.has(url)) {
		return true;
	}

	// Common badge hosts.
	return url.includes('shields.io') || url.includes('badge.svg') || url.includes('/badge');
};

const isSvg = url => url.toLowerCase().split('?')[0].endsWith('.svg');

const isHiDpiFilename = url => {
	const clean = url.toLowerCase().split('?')[0];
	return clean.includes('@2x') || clean.includes('2x.');
};

function readImageDimensions(filePath) {
	const buffer = fs.readFileSync(filePath);

	// PNG
	if (buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
		return {
			width: buffer.readUInt32BE(16),
			height: buffer.readUInt32BE(20),
		};
	}

	// JPEG
	if (buffer.length >= 4 && buffer[0] === 0xFF && buffer[1] === 0xD8) {
		let offset = 2;
		while (offset < buffer.length) {
			if (buffer[offset] !== 0xFF) {
				offset++;
				continue;
			}

			const marker = buffer[offset + 1];
			offset += 2;

			// Standalone markers
			if (marker === 0xD9 || marker === 0xDA) {
				break;
			}

			const size = buffer.readUInt16BE(offset);
			if (size < 2) {
				break;
			}

			// SOF0, SOF2
			if (marker === 0xC0 || marker === 0xC2) {
				const height = buffer.readUInt16BE(offset + 3);
				const width = buffer.readUInt16BE(offset + 5);
				return {width, height};
			}

			offset += size;
		}
	}

	return undefined;
}

function validateHeaderImage({url, width, height, cwd}) {
	if (!url || typeof url !== 'string') {
		return {ok: true};
	}

	if (isProbablyBadge(url)) {
		return {ok: true};
	}

	if (isSvg(url)) {
		return {ok: true};
	}

	if (isHiDpiFilename(url)) {
		return {ok: true};
	}

	// Best-effort: if local file and HTML specifies display width/height, ensure 2x.
	if (typeof width === 'number' && typeof height === 'number') {
		const localPath = url.startsWith('http') ? undefined : path.resolve(cwd, url);
		if (localPath && fs.existsSync(localPath)) {
			const dims = readImageDimensions(localPath);
			if (dims && dims.width >= width * 2 && dims.height >= height * 2) {
				return {ok: true};
			}
		}
	}

	return {ok: false};
}

function findTopHeaderImages(ast) {
	// Two common patterns:
	// 1) Markdown heading with inline images.
	// 2) Raw HTML block at the top with <img ...>.
	const images = [];

	// HTML at the top-level (some repos use multiple HTML blocks before any markdown)
	if (Array.isArray(ast.children) && ast.children.length > 0) {
		for (const child of ast.children) {
			if (child.type !== 'html') {
				break;
			}

			const html = child.value;
			for (const match of html.matchAll(/<img\s+[^>]*>/gi)) {
				const tag = match[0];
				const src = /src\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
				const width = Number.parseInt(/width\s*=\s*["']?(\d+)["']?/i.exec(tag)?.[1], 10);
				const height = Number.parseInt(/height\s*=\s*["']?(\d+)["']?/i.exec(tag)?.[1], 10);
				images.push({url: src, width: Number.isFinite(width) ? width : undefined, height: Number.isFinite(height) ? height : undefined});
			}
		}

		if (images.length > 0) {
			return images;
		}
	}

	// First H1 heading
	visit(ast, 'heading', (node, index) => {
		if (index !== 0 || node.depth !== 1) {
			return;
		}

		for (const child of node.children) {
			if (child.type === 'image') {
				images.push({url: child.url});
			}

			if (child.type === 'link') {
				for (const sub of child.children ?? []) {
					if (sub.type === 'image') {
						images.push({url: sub.url});
					}
				}
			}
		}

		return visit.EXIT;
	});

	return images;
}

const headerImageRule = lintRule('remark-lint:awesome-header-image', (ast, file) => {
	const headerImages = findTopHeaderImages(ast).filter(({url}) => url && !isProbablyBadge(url));
	if (headerImages.length === 0) {
		return;
	}

	const cwd = path.dirname(file.path ?? process.cwd());
	for (const image of headerImages) {
		const result = validateHeaderImage({...image, cwd});
		if (!result.ok) {
			file.message('Header image must be SVG or high-DPI (e.g. @2x, or 2× pixel dimensions)', ast);
			return;
		}
	}
});

export default headerImageRule;
