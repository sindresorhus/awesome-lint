import {find} from 'unist-util-find';
import {findAllAfter} from 'unist-util-find-all-after';
import {findAllBefore} from 'unist-util-find-all-before';
import findAllBetween from 'unist-util-find-all-between';
import {lintRule} from 'unified-lint-rule';
import GitHubSlugger from 'github-slugger';
import {toString} from 'mdast-util-to-string';
import {visit} from 'unist-util-visit';

const slugger = new GitHubSlugger();

const maxListItemDepth = 1;

const sectionHeadingDenylist = new Set([
	'Contributing',
	'Footnotes',
	'Related Lists',
]);

const tocRule = lintRule('remark-lint:awesome-toc', (ast, file) => {
	slugger.reset();

	// Heading links are order-dependent, so it's important to gather them up front
	const headingLinks = buildHeadingLinks(ast);

	const toc = find(ast, node => (
		node.type === 'heading'
		&& node.depth === 2
		&& toString(node).replaceAll(/<!--.*?-->/g, '').trim() === 'Contents'
	));

	if (!toc) {
		// Table of Contents is now optional - don't report an error if missing
		return;
	}

	const headingsPre = findAllBefore(ast, toc, {
		type: 'heading',
	});

	const htmlPre = findAllBefore(ast, toc, {
		type: 'html',
	});

	if (headingsPre.length > 1) {
		file.message('Table of Contents must be the first section', toc);
	} else if (headingsPre.length === 0 && htmlPre.length === 0) {
		file.message('First heading should be name of awesome list', toc);
	}

	const headingsPost = findAllAfter(ast, toc, {
		type: 'heading',
		depth: 2,
	}).filter(node => !sectionHeadingDenylist.has(toString(node)));

	if (headingsPost.length === 0) {
		file.message('Missing content headers', ast);
		return;
	}

	const tocLists = findAllBetween(ast, toc, headingsPost[0], 'list');

	if (tocLists.length === 0) {
		file.message('Missing or invalid Table of Contents list', toc);
	} else if (tocLists.length > 1) {
		file.message('Multiple Table of Contents lists found', toc);
	} else {
		const tocList = tocLists[0];

		// Validate list items against heading sections recursively
		validateListItems({
			ast,
			file,
			list: tocList,
			headingLinks,
			headings: headingsPost,
			depth: 0,
		});
	}
});

function buildHeadingLinks(ast) {
	const links = {};

	visit(ast, 'heading', node => {
		const text = toString(node);

		// Normalize text to remove variation selectors that GitHub ignores
		const normalizedText = text.replaceAll('\uFE0F', '');

		const slug = slugger.slug(normalizedText);
		const link = `#${slug}`;

		links[link] = node;
	});

	return links;
}

function isHeadingUnderDeniedSection(ast, heading) {
	// Find all level 2 headings before this heading
	const level2HeadingsBefore = findAllBefore(ast, heading, {
		type: 'heading',
		depth: 2,
	});

	// Get the most recent (last) level 2 heading - this is the parent section
	const parentSection = level2HeadingsBefore.at(-1);
	if (parentSection) {
		const parentText = toString(parentSection);
		return sectionHeadingDenylist.has(parentText);
	}

	return false;
}

function validateListItems({ast, file, list, headingLinks, headings, depth}) {
	let index = 0;

	if (list) {
		for (; index < list.children.length; ++index) {
			const listItem = list.children[index];
			const link = find(listItem, n => n.type === 'link');

			if (!link) {
				file.message(`ToC item "${index}" missing link "${toString(listItem)}"`, listItem);
				return;
			}

			const {url} = link;
			const text = toString(link);
			const heading = headings[index];
			const headingText = heading && toString(heading);

			if (!text) {
				file.message(`ToC item "${url}" missing link text`, listItem);
				return;
			}

			if (!headingText) {
				if (sectionHeadingDenylist.has(text)) {
					file.message(`ToC should not contain section "${text}"`, listItem);
				} else {
					file.message(`ToC item "${text}" missing corresponding heading`, listItem);
				}

				return;
			}

			if (text !== headingText) {
				file.message(`ToC item "${text}" does not match corresponding heading "${headingText}"`, listItem);
				return;
			}

			const headingLink = headingLinks[url];

			if (headingLink) {
				// Remember that we've referenced this link previously
				headingLinks[url] = false;
			} else if (headingLink === undefined) {
				// This link doesn't exist as a section in the content
				file.message(`ToC item "${text}" link "${url}" not found`, listItem);
				return;
			} else {
				// This link was used previously, so it must be a duplicate
				file.message(`ToC item "${text}" has duplicate link "${url}"`, listItem);
				return;
			}

			const subList = find(listItem, n => n.type === 'list');

			if (subList) {
				if (depth < maxListItemDepth) {
					const nextHeading = headings[index + 1];
					const allSubHeadings = nextHeading
						? findAllBetween(ast, heading, nextHeading, {
							type: 'heading',
							depth: depth + 3,
						})
						: findAllAfter(ast, heading, {
							type: 'heading',
							depth: depth + 3,
						});

					// Filter out subheadings that are under denied sections
					const subHeadings = allSubHeadings.filter(subHeading =>
						!isHeadingUnderDeniedSection(ast, subHeading));

					validateListItems({
						ast,
						file,
						list: subList,
						headingLinks,
						headings: subHeadings,
						depth: depth + 1,
					});
				} else {
					file.message(`Exceeded max depth of ${maxListItemDepth + 1} levels`, listItem);
				}
			} else {
				// No need to enforce the existence of a subList, even if there are corresponding
				// subHeadings.
			}
		}
	}

	if (index < headings.length) {
		for (; index < headings.length; ++index) {
			const heading = headings[index];
			file.message(`ToC missing item for "${toString(heading)}"`, list);
		}
	}
}

export default tocRule;
