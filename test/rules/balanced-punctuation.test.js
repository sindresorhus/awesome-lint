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

	// Regression test for #104 and https://github.com/laysent/remark-lint-plugins/issues/44.
	// The custom balanced-punctuation rule (af84612b5d0c) reintroduced the
	// apostrophe false-positive that was fixed in match-punctuation (234526338dee).
	it('should not false-positive on apostrophes in possessives and contractions', async () => {
		const config = {
			plugins: [
				remarkLint,
				balancedPunctuationRule,
			],
		};

		const messages = await lint({
			config,
			filename: 'test/fixtures/balanced-punctuation/apostrophes-valid.md',
		});

		const errors = messages.filter(m => m.ruleId === 'balanced-punctuation');
		assert.equal(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors, null, 2)}`);
	});

	it('should detect unmatched curly single quotes that are not apostrophes', async () => {
		const config = {
			plugins: [
				remarkLint,
				balancedPunctuationRule,
			],
		};

		const messages = await lint({
			config,
			filename: 'test/fixtures/balanced-punctuation/apostrophes-invalid.md',
		});

		const errors = messages.filter(m => m.ruleId === 'balanced-punctuation');
		assert.ok(errors.length > 0, 'Should detect unmatched curly single quotes');
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
