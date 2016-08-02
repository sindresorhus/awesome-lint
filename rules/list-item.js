'use strict';
const visit = require('unist-util-visit');

module.exports = (ast, file, language, done) => {
	visit(ast, 'list', list => {
		let position;
		for (const item of list.children) {
			position = JSON.parse(JSON.stringify(item.position));
			if (position.start.line !== position.end.line) {
				position.start.line++;
				file.warn('Items must start with \'- [name][link]\'', position);
			}

			try { // TODO: seems like unist-util-visit does not supports sublists
				const description = item.children[0].children[1].value;
				if (!description.startsWith(' - ')) {
					file.warn('Items must have a \'-\' between the link and the description', position);
				}
			} catch (err) {
				if (err.message !== 'Cannot read property \'value\' of undefined') {
					throw err;
				}
			}
		}
	});
	done();
};
