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
		}
	});
	done();
};
