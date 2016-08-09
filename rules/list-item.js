'use strict';
const caseOf = require('case').of;
const visit = require('unist-util-visit');

const util = require('./util');

module.exports = (ast, file) => {
	visit(ast, 'list', list => {
		let hasDescriptions = false;
		for (const item of list.children) {
			let position = item.position;
			if (position.start.line !== position.end.line) {
				try {
					const child = item.children && item.children[1];
					if (child.type !== 'list') {
						// TODO: check if the execution somehow reaches this line
						// probably it will always fall into the catch
						position.start.line++;
						file.warn('List items must start with `- [name](link)`', position);
					}
				} catch (err) {
					position.start.line++;
					file.warn('List items must start with `- [name](link)`', position);
				}
			}

			const description = item.children[0].children.slice(1).reduce((prev, cur) => {
				if (cur.type === 'inlineCode') {
					return prev + `\`${cur.value}\``;
				}
				return prev + cur.value;
			}, '');

			if (description.length === 0) {
				const link = util.getUrlFromItem(item);
				if (link && link.startsWith('#') && !hasDescriptions) {
					// If the execution get here in the first list item, it will assume
					// that the list is a `Contents` section
					// It will not happen to an item other than the first – we check if
					// the list has any items with descriptions.
					return false; // stops the `visit` for this list
				}
				file.warn('List items must have a description', position);
			} else {
				hasDescriptions = true;
				if (!description.startsWith(' - ')) {
					file.warn('List items must have a ` - ` between the link and the description', position);
				}

				const firstWord = description.split(' ')[2];
				if (['camel', 'capital', 'constant'].indexOf(caseOf(firstWord)) === -1) {
					if (!firstWord.startsWith('`')) {
						file.warn('The description must start with an uppercase, camelCase word or `code`', position);
					}
				}

				if (!description.endsWith('.') && !description.endsWith('!')) {
					file.warn('The description of a list item must end with `.` or `!`', position);
				}
			}
		}
	});
};
