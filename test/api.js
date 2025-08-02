import {test, expect} from 'vitest';

test('x', () => {
	expect(true).toBe(true);
});

test('main', async () => {
	const result = await lint({filename: 'test/fixtures/main.md'});
	expect(result.messages.length).toBeGreaterThan(0);
});

test('`reporter` option', async () => {
	let wasReporterCalled = false;
	const reporter = reports => {
		if (reports.length > 0) {
			wasReporterCalled = true;
		}
	};

	await lint.report({filename: 'test/fixtures/main.md', reporter});
	expect(wasReporterCalled).toBe(true);
});
