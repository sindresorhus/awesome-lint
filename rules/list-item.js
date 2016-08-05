'use strict';
const caseOf = require('case').of;
const visit = require('unist-util-visit');

module.exports = (ast, file, language, done) => {
	visit(ast, 'list', list => {
		let position;
		for (const item of list.children) {
			position = JSON.parse(JSON.stringify(item.position));
			if (position.start.line !== position.end.line) {
				position.start.line++;
				file.warn('List items must start with `- [name](link)`', position);
			}

			try { // TODO: seems like unist-util-visit does not supports sublists
				const description = item.children[0].children.slice(1).reduce((prev, cur) => {
					if (cur.type === 'inlineCode') {
						return prev + `\`${cur.value}\``;
					}
					return prev + cur.value;
				}, '');

				if (!description.startsWith(' - ')) {
					file.warn('List items must have a ` - ` between the link and the description', position);
				}

				const firstWorld = description.split(' ')[2];
				if (['camel', 'capital', 'constant'].indexOf(caseOf(firstWorld)) === -1) {
					if (!firstWorld.startsWith('`')) {
						file.warn('The description must start with an uppercase, camelCase world or `code`', position);
					}
				}

				if (!description.endsWith('.') && !description.endsWith('!')) {
					file.warn('The description of a list item must end with `.` or `!`', position);
				}
			} catch (err) {
				if (!/Cannot read property '\w+' of undefined/.test(err.message)) {
					throw err;
				}
			}
		}
	});
	done();
};
