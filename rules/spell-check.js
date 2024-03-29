import isUrl from 'is-url-superb';
import {lintRule} from 'unified-lint-rule';
import {visit} from 'unist-util-visit';
import arrify from 'arrify';
import spellCheckRules from '../lib/spell-check-rules.js';

const wordBreakCharacterAllowList = new Set([
	'-',
]);

const spellCheckRule = lintRule('remark-lint:awesome-spell-check', (ast, file) => {
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
						const previousChar = sanitizedValue[match.index - 1];
						const nextChar = sanitizedValue[match.index + match[0].length];

						if (wordBreakCharacterAllowList.has(previousChar)) {
							continue;
						}

						if (wordBreakCharacterAllowList.has(nextChar)) {
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

export default spellCheckRule;
