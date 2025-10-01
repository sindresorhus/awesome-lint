import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import lint from '../_lint.js';
import balancedPunctuationRule from '../../rules/balanced-punctuation.js';

describe('balanced-punctuation', () => {
	it('should use defaults when no config provided', async () => {
		const config = {
			plugins: [
				remarkLint,
				balancedPunctuationRule,
			],
		};

		const messages = await lint({
			config,
			filename: 'test/fixtures/balanced-punctuation/unmatched-curly.md',
		});

		const errors = messages.filter(m => m.ruleId === 'balanced-punctuation');

		// Should detect unmatched straight quote (in defaults)
		assert.ok(errors.length > 0, 'Should detect unmatched quotes');
	});

	it('should use only specified pairs', async () => {
		const config = {
			plugins: [
				remarkLint,
				[balancedPunctuationRule, [['⟨', '⟩']]],
			],
		};

		const messages = await lint({
			config,
			filename: 'test/fixtures/balanced-punctuation/angle-brackets.md',
		});

		const errors = messages.filter(m => m.ruleId === 'balanced-punctuation');

		// Should detect the unmatched angle bracket
		assert.ok(errors.length > 0, 'Should detect unmatched angle bracket');
		const hasAngleBracketError = errors.some(error => error.message.includes('⟨'));
		assert.ok(hasAngleBracketError, 'Should detect angle bracket mismatch');
	});

	it('should use symmetric pairs with single-character string', async () => {
		const config = {
			plugins: [
				remarkLint,
				[balancedPunctuationRule, ['"']], // Straight quotes only
			],
		};

		const messages = await lint({
			config,
			filename: 'test/fixtures/balanced-punctuation/unmatched-curly.md',
		});

		const errors = messages.filter(m => m.ruleId === 'balanced-punctuation');

		// File has unmatched straight quote, should detect it
		assert.ok(errors.length > 0, 'Should detect straight quotes');
	});

	it('should not detect defaults when using custom config', async () => {
		const config = {
			plugins: [
				remarkLint,
				[balancedPunctuationRule, [['\u201C', '\u201D']]], // Only curly quotes
			],
		};

		const messages = await lint({
			config,
			filename: 'test/fixtures/balanced-punctuation/unmatched-curly.md',
		});

		const errors = messages.filter(m => m.ruleId === 'balanced-punctuation');

		// Should not detect straight quotes (not in config, only curly quotes configured)
		assert.equal(errors.length, 0, 'Should not detect straight quotes when only curly quotes configured');
	});
});
