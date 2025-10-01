/**
Remark lint plugin to check for balanced punctuation pairs.

This plugin checks that opening punctuation (like quotes and brackets) have corresponding closing punctuation, and vice versa. It handles both symmetric pairs (where open and close are the same, like straight quotes) and asymmetric pairs (where open and close differ, like curly quotes).

Configuration:
- No config: Uses defaults (curly quotes, CJK brackets, straight quotes)
- Array with pairs: Uses only specified pairs (replaces defaults)

Pair formats:
- Single-character string: '"' (symmetric pair only)
- Array of two characters: ['"', '"'] or ['⟨', '⟩']
*/

import {lintRule} from 'unified-lint-rule';
import {visit} from 'unist-util-visit';

/**
Node types that can contain text to check for punctuation.

@type {Set<string>}
*/
const TEXT_CONTAINER_NODE_TYPES = new Set([
	'paragraph',
	'heading',
	'listItem',
	'blockquote',
]);

/**
Default punctuation pairs to check.

Uses the public API format (arrays and strings).

@type {Array<string|Array>}
*/
const defaultPairs = [
	// Curly double quotes (asymmetric - different characters for open/close)
	['\u201C', '\u201D'], // " and "
	['\u2018', '\u2019'], // ' and '

	// Chinese, Japanese, and Korean brackets (asymmetric)
	['\u300E', '\u300F'], // 『 and 』
	['\uFF08', '\uFF09'], // （ and ）
	['\u300A', '\u300B'], // 《 and 》
	['\u300C', '\u300D'], // 「 and 」
	['\u3010', '\u3011'], // 【 and 】

	// Straight quotes (symmetric - same character for open/close)
	// Note: Single quotes are excluded by default to avoid apostrophe false positives
	'"',
];

/**
Normalize a single pair specification into a pair object.

@param {string|Array} pair - Pair specification (single-char string or array of two characters).
@returns {{left: string, right: string, symmetric: boolean}}
*/
function normalizePair(pair) {
	// Handle single-character string format (symmetric pairs only)
	if (typeof pair === 'string') {
		if (pair.length === 1) {
			// Single-character string (symmetric) like '"'
			return {
				left: pair,
				right: pair,
				symmetric: true,
			};
		}

		const left = JSON.stringify(pair[0]);
		const right = JSON.stringify(pair[1] ?? pair[0]);
		throw new Error(`Invalid pair string: "${pair}". String format only supports single characters for symmetric pairs. Use array format instead: [${left}, ${right}]`);
	}

	// Handle array format
	if (Array.isArray(pair)) {
		if (pair.length !== 2) {
			throw new Error(`Invalid pair array: ${JSON.stringify(pair)}. Must have exactly 2 elements.`);
		}

		const [left, right] = pair;

		// Validate that left and right are single characters
		if (typeof left !== 'string' || left.length !== 1) {
			throw new Error(`Invalid pair[0]: ${JSON.stringify(left)}. Must be a single character.`);
		}

		if (typeof right !== 'string' || right.length !== 1) {
			throw new Error(`Invalid pair[1]: ${JSON.stringify(right)}. Must be a single character.`);
		}

		return {
			left,
			right,
			symmetric: left === right,
		};
	}

	throw new Error(`Invalid pair configuration: ${JSON.stringify(pair)}. Must be a single-character string or an array.`);
}

/**
Parse configuration into normalized pair objects.

Configuration format:
- No config or empty array: Use defaults
- Array with pairs: Use only specified pairs

@param {Array|undefined} config - User configuration.
@returns {Array<{left: string, right: string, symmetric: boolean}>}

@example
// Use defaults
parsePairs()
parsePairs([])

@example
// Use custom pairs only
parsePairs(['⟨⟩', '⟪⟫'])
*/
function parsePairs(config) {
	// No config or empty array: use defaults
	if (!config || config.length === 0) {
		return defaultPairs.map(pair => normalizePair(pair));
	}

	// Use specified pairs only
	return config.map(pair => normalizePair(pair));
}

/**
Punctuation characters that can appear after an apostrophe.

Includes whitespace, common punctuation, brackets, and quotes.

@type {RegExp}
*/
const PUNCTUATION_AFTER_APOSTROPHE = /[\s.,;:!?()[\]{}"""''—–]/u;

/**
Check if a character is part of a word (letter, digit, or underscore).

@param {string|undefined} character - Character to check.
@returns {boolean}
*/
function isWordCharacter(character) {
	if (!character) {
		return false;
	}

	return /[\p{Letter}\p{Number}_]/u.test(character);
}

/**
Check if a quote character is likely an apostrophe (within a word).

Returns true for: "don't", "it's", "students'", "1990's", "don't""

Returns false for: "'hello", standalone quotes

@param {string} text - Full text being analyzed.
@param {number} index - Index of the character in question.
@returns {boolean}
*/
function isApostrophe(text, index) {
	const before = text[index - 1];
	const after = text[index + 1];

	// Must have a word character before to be an apostrophe
	if (!isWordCharacter(before)) {
		return false;
	}

	// Apostrophe can be:
	// 1. Between word characters: "don't"
	// 2. At end of word followed by whitespace/punctuation: "students' books"
	// 3. At end of word followed by quotes: "don't""
	// 4. At absolute end of text: "students'"
	return isWordCharacter(after) || !after || PUNCTUATION_AFTER_APOSTROPHE.test(after);
}

/**
Extract all text content from a node and its descendants.

@param {object} node - AST node to extract text from.
@returns {{text: string, positions: Array<object>}} Text and corresponding position info for each character.
*/
function extractText(node) {
	const textChunks = [];
	const positions = [];

	visit(node, 'text', textNode => {
		const {value} = textNode;

		// Iterate through the string, handling Unicode correctly
		for (const character of value) {
			textChunks.push(character);
			positions.push(textNode.position);
		}
	});

	return {text: textChunks.join(''), positions};
}

/**
Handle symmetric punctuation pairs (same character for open/close).

For proper nesting, we check if the last stack item matches. If not, we report an error (improper nesting or unmatched quote).

@param {object} context - Execution context with all necessary data.
*/
function handleSymmetricPair(context) {
	const {character, position, stack, symmetricState, symmetricPairs, file} = context;
	const pair = symmetricPairs.get(character);
	const expectingClose = symmetricState.get(character);

	if (expectingClose) {
		// This is a closing quote
		const lastItem = stack.at(-1);
		const hasMatch = lastItem?.pair?.left === character;

		if (hasMatch) {
			stack.pop();
			symmetricState.set(character, false);
		} else {
			// Improper nesting or unmatched closing quote
			file.message(
				`Unmatched closing ${character} without corresponding opening ${character}`,
				position,
			);

			// Reset state to allow recovery - treat this as if we're now expecting an opening
			symmetricState.set(character, false);
		}

		return;
	}

	// This is an opening quote
	stack.push({pair, position});
	symmetricState.set(character, true);
}

/**
Handle asymmetric right punctuation (closing).

Searches the stack for the matching opening punctuation.

@param {object} context - Execution context with all necessary data.
*/
function handleAsymmetricRight(context) {
	const {character, position, stack, rightCharacters, file} = context;
	const pair = rightCharacters.get(character);

	// Find matching opening on stack (most recent occurrence)
	const stackIndex = stack.findLastIndex(item => item?.pair === pair);

	if (stackIndex === -1) {
		// No matching opening found
		file.message(
			`Unmatched closing ${character} without corresponding opening ${pair.left}`,
			position,
		);

		return;
	}

	// Found matching pair - remove it from stack
	stack.splice(stackIndex, 1);
}

/**
Process text for punctuation matching using a stack-based algorithm.

@param {object} context - Execution context with all necessary data.
*/
function processText(context) {
	const {text, positions, leftCharacters, rightCharacters, symmetricPairs, file} = context;

	// Early exit if no text to process
	if (text.length === 0) {
		return;
	}

	const stack = [];
	const symmetricState = new Map();

	// Initialize symmetric state - character -> boolean (true means expecting close)
	for (const symbol of symmetricPairs.keys()) {
		symmetricState.set(symbol, false); // Start expecting open
	}

	for (let index = 0; index < text.length; index++) {
		const character = text[index];
		const position = positions[index];

		// Skip apostrophes (contractions like "don't", "it's")
		if ((character === '\u2019' || character === '\'') && isApostrophe(text, index)) {
			continue;
		}

		// Check for symmetric pairs (example: straight quotes)
		if (symmetricPairs.has(character)) {
			handleSymmetricPair({
				character,
				position,
				stack,
				symmetricState,
				symmetricPairs,
				file,
			});

			continue;
		}

		// Check for asymmetric left punctuation (opening)
		if (leftCharacters.has(character)) {
			const pair = leftCharacters.get(character);
			stack.push({pair, position});
			continue;
		}

		// Check for asymmetric right punctuation (closing)
		if (rightCharacters.has(character)) {
			handleAsymmetricRight({
				character,
				position,
				stack,
				rightCharacters,
				file,
			});
		}
	}

	// Report any unclosed punctuation remaining on stack
	for (const item of stack) {
		file.message(
			`Unclosed ${item.pair.left} without matching closing ${item.pair.right}`,
			item.position,
		);
	}
}

/**
Check for balanced punctuation pairs in text using a stack-based algorithm.

Checks for balanced punctuation across text content nodes.

@param {object} tree - Abstract syntax tree.
@param {object} file - Virtual file.
@param {Array|undefined} options - Configuration options.
*/
function balancedPunctuation(tree, file, options) {
	const pairs = parsePairs(options);

	// Early exit if no pairs configured
	if (pairs.length === 0) {
		return;
	}

	// Build lookup maps for constant-time access
	const leftCharacters = new Map(); // Asymmetric left chars only
	const rightCharacters = new Map(); // Asymmetric right chars only
	const symmetricPairs = new Map(); // Symmetric pairs: char -> pair object

	for (const pair of pairs) {
		if (pair.symmetric) {
			// Symmetric pairs are handled separately and checked first
			symmetricPairs.set(pair.left, pair);
		} else {
			// Asymmetric pairs need to be in the left/right maps
			leftCharacters.set(pair.left, pair);
			rightCharacters.set(pair.right, pair);
		}
	}

	// Visit each node that could contain text
	visit(tree, node => {
		// Skip code blocks and inline code to avoid false positives
		if (node.type === 'code' || node.type === 'inlineCode') {
			return 'skip';
		}

		// Process text container nodes
		// We check listItem and blockquote (containers) to match punctuation
		// across multiple paragraphs within them
		if (!TEXT_CONTAINER_NODE_TYPES.has(node.type)) {
			return;
		}

		const {text, positions} = extractText(node);
		processText({
			text,
			positions,
			leftCharacters,
			rightCharacters,
			symmetricPairs,
			file,
		});

		// CRITICAL: Skip children to avoid duplicate processing
		// If we process a listItem, don't also process its child paragraphs
		return 'skip';
	});
}

const balancedPunctuationRule = lintRule(
	'remark-lint:balanced-punctuation',
	balancedPunctuation,
);

export default balancedPunctuationRule;
