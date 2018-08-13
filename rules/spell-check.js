'use strict';
const rule = require('unified-lint-rule');
const visit = require('unist-util-visit');
const spellCheckRules = require('../lib/spell-check-rules');

const wordBreakCharacterWhitelist = new Set([
	'-'
]);

module.exports = rule('remark-lint:awesome/spell-check', (ast, file) => {
	visit(ast, 'text', node => {
		if (!node.value) {
			return;
		}

		for (const rule of spellCheckRules) {
			const {test, value} = rule;
			const re = new RegExp(test);

			for (;;) {
				const match = re.exec(node.value);
				if (!match) {
					break;
				}

				if (match[0] !== value) {
					const prevCharacter = node.value[match.index - 1];
					const nextCharacter = node.value[match.index + match[0].length];

					if (wordBreakCharacterWhitelist.has(prevCharacter)) {
						continue;
					}

					if (wordBreakCharacterWhitelist.has(nextCharacter)) {
						continue;
					}

					file.message(`Text "${match}" should be written as "${value}"`, node);
					break;
				}
			}
		}
	});
});
