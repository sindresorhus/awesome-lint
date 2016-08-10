'use strict';
const caseOf = require('case').of;
const visit = require('unist-util-visit');
const nodeToString = require('mdast-util-to-string');

module.exports = (ast, file) => {
	visit(ast, 'list', list => {
		let listHasDescriptions = false;
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
				// we need to `slice(1)` the children so we can discard the link (`[name](link)`)
				if (cur.type === 'inlineCode') {
					return `${prev}\`${cur.value}\``;
				}
				if (cur.type !== 'text') {
					file.warn('The description of a list item must contain only plain text and/or `code`', position);
				}
				return prev + nodeToString(cur);
			}, '');

			if (description.length === 0) {
				if (listHasDescriptions) {
					// if any other list in this item have a description, the current one
					// must have too
					file.warn('List items must have a description', position);
				}
			} else {
				listHasDescriptions = true;
				if (!description.startsWith(' - ')) {
					file.warn('List items must have a ` - ` between the link and the description', position);
				}

				let firstWord = description.split(' ')[2]; // ` - desc`.split(' ') === ['', '-', 'desc']
				if (firstWord === undefined) {
					// when link and description are separated with only a ` ` && the description
					// has only one word
					firstWord = description.split(' ')[1]; // ` desc`.split(' ') === ['', 'desc']
				}
				if (['camel', 'capital', 'constant', 'pascal'].indexOf(caseOf(firstWord)) === -1) {
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
