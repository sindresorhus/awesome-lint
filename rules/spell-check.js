import isUrl from 'is-url-superb';
import {lintRule} from 'unified-lint-rule';
import {visit} from 'unist-util-visit';
import arrify from 'arrify';
import spellCheckRules from '../lib/spell-check-rules.js';

// Characters that are allowed adjacent to words without breaking spell-check
const wordBreakCharacterAllowList = new Set([
	'-',
	'_', // Allow underscores for package names like awesome_package
	'.', // Allow dots for names like .NET
]);

// Convert string/regex patterns to compiled regexes
function compilePattern(pattern) {
	if (typeof pattern === 'string') {
		// Simple string - create case-insensitive word boundary regex
		return new RegExp(`\\b${pattern.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)}\\b`, 'gi');
	}

	// Already a regex - compile it fresh
	return new RegExp(pattern.source, pattern.flags);
}

// Pre-compile all regexes for performance
const compiledRules = spellCheckRules.map(rule => ({
	regexes: arrify(rule.test).map(test => compilePattern(test)),
	value: rule.value,
}));

// Create spell-check error message
function createSpellCheckMessage(incorrect, correct) {
	return `Text "${incorrect}" should be written as "${correct}"`;
}

// Cache for processed text to avoid duplicate work
const processedTextCache = new Map();

const spellCheckRule = lintRule('remark-lint:awesome-spell-check', (ast, file) => {
	// Clear cache for each file to prevent memory leaks
	processedTextCache.clear();

	visit(ast, 'text', node => {
		if (!node.value?.trim()) {
			return;
		}

		// Check cache first
		const cacheKey = node.value;

		if (processedTextCache.has(cacheKey)) {
			const cachedResults = processedTextCache.get(cacheKey);
			for (const error of cachedResults) {
				file.message(error.message, node);
			}

			return;
		}

		// Skip URLs and filter out empty segments
		const sanitizedSegments = node.value
			.split(/\s+/g)
			.filter(segment => segment && !isUrl(segment));

		if (sanitizedSegments.length === 0) {
			processedTextCache.set(cacheKey, []);
			return;
		}

		const sanitizedValue = sanitizedSegments.join(' ');
		const errors = [];

		for (const rule of compiledRules) {
			const {regexes, value} = rule;
			let ruleMatched = false;

			for (const regex of regexes) {
				if (ruleMatched) {
					break; // Only report first match per rule
				}

				// Reset regex lastIndex to avoid state issues
				regex.lastIndex = 0;

				for (;;) {
					const match = regex.exec(sanitizedValue);
					if (!match) {
						break;
					}

					// Skip if the match is already correct
					if (match[0] === value) {
						continue;
					}

					// Check word boundaries - skip if adjacent to allowed characters
					const previousChar = sanitizedValue[match.index - 1];
					const nextChar = sanitizedValue[match.index + match[0].length];

					if (wordBreakCharacterAllowList.has(previousChar)
						|| wordBreakCharacterAllowList.has(nextChar)) {
						continue;
					}

					const errorMessage = createSpellCheckMessage(match[0], value);
					errors.push({message: errorMessage});
					file.message(errorMessage, node);
					ruleMatched = true;
					break; // Only report first occurrence per regex
				}
			}
		}

		// Cache the results
		processedTextCache.set(cacheKey, errors);
	});
});

export default spellCheckRule;
