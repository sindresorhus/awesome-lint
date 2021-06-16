'use strict';
const isUrl = require('is-url-superb');
const rule = require('unified-lint-rule');
const visit = require('unist-util-visit');
const arrify = require('arrify');
const spellCheckRules = require('../lib/spell-check-rules.js');

const wordBreakCharacterAllowList = new Set([
	'-'
]);

module.exports = rule('remark-lint:awesome-spell-check', (ast, file) => {
	visit(ast, 'text', node => {
		if (!node.value) {
			return;
		}

		const sanitizedSegments = [];
		for (const segment of node.value.split(/\s/g)) {
			if (!isUrl(segment)) {
				sanitizedSegments.push(segment);
			}
		}

		const sanitizedValue = sanitizedSegments.join(' ');

		for (const rule of spellCheckRules) {
			const {test, value} = rule;
			const regs = arrify(test).map(reg => new RegExp(reg));

			for (const re of regs) {
				for (;;) {
					const match = re.exec(sanitizedValue);
					if (!match) {
						break;
					}

					if (match[0] !== value) {
						const previousCharacter = sanitizedValue[match.index - 1];
						const nextCharacter = sanitizedValue[match.index + match[0].length];

						if (wordBreakCharacterAllowList.has(previousCharacter)) {
							continue;
						}

						if (wordBreakCharacterAllowList.has(nextCharacter)) {
							continue;
						}

						file.message(`Text "${match[0]}" should be written as "${value}"`, node);
						break;
					}
				}
			}
		}
	});
});
