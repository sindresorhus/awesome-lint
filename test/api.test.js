import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import process from 'node:process';
import remarkLint from 'remark-lint';
import config, {createConfig} from '../config.js';
import lint from '../index.js';
import heading from '../rules/heading.js';
import {createRules} from '../rules/index.js';
import spellCheck from '../rules/spell-check.js';

describe('api', () => {
	function headingWarnPreset() {
		this.use(heading, ['warn']);
	}

	it('x', () => {
		assert.ok(true);
	});

	it('createConfig with repoURL includes remark-lint rules', () => {
		const customRules = createRules({repoURL: 'https://github.com/test/test'});
		const customConfig = createConfig(customRules);

		assert.equal(customConfig.length, config.length, 'Custom config should have the same number of plugins as the default config');

		// Verify remark-lint plugins are present (not just custom rules)
		assert.ok(customConfig.length > customRules.length, 'Config should include remark-lint rules in addition to custom rules');
	});

	it('report fails for code-of-conduct violations', async () => {
		const previousExitCode = process.exitCode;
		process.exitCode = undefined;
		let spinnerMethod;
		const spinner = {
			succeed() {
				spinnerMethod = 'succeed';
			},
			fail() {
				spinnerMethod = 'fail';
			},
		};

		try {
			await lint._report({
				config: [],
				filename: 'test/fixtures/code-of-conduct/error0/readme.md',
				reporter: () => '',
			}, spinner);

			assert.equal(spinnerMethod, 'fail');
			assert.equal(process.exitCode, 1);
		} finally {
			process.exitCode = previousExitCode;
		}
	});

	it('report fails for plain custom plugin violations', async () => {
		const previousExitCode = process.exitCode;
		process.exitCode = undefined;
		let spinnerMethod;
		const spinner = {
			succeed() {
				spinnerMethod = 'succeed';
			},
			fail() {
				spinnerMethod = 'fail';
			},
		};

		try {
			await lint._report({
				config: [remarkLint, heading],
				filename: 'test/fixtures/heading/error0.md',
				reporter: () => '',
			}, spinner);

			assert.equal(spinnerMethod, 'fail');
			assert.equal(process.exitCode, 1);
		} finally {
			process.exitCode = previousExitCode;
		}
	});

	it('report respects custom warn severity', async () => {
		const previousExitCode = process.exitCode;
		process.exitCode = 1;
		let spinnerMethod;
		const spinner = {
			succeed() {
				spinnerMethod = 'succeed';
			},
			fail() {
				spinnerMethod = 'fail';
			},
		};

		try {
			await lint._report({
				config: [remarkLint, [heading, ['warn']]],
				filename: 'test/fixtures/heading/error0.md',
				reporter: () => '',
			}, spinner);

			assert.equal(spinnerMethod, 'succeed');
			assert.equal(process.exitCode, 1);
		} finally {
			process.exitCode = previousExitCode;
		}
	});

	it('report supports preset-style configs', async () => {
		const previousExitCode = process.exitCode;
		process.exitCode = 1;
		let spinnerMethod;
		const spinner = {
			succeed() {
				spinnerMethod = 'succeed';
			},
			fail() {
				spinnerMethod = 'fail';
			},
		};

		try {
			await lint._report({
				config: {
					plugins: [
						remarkLint,
						[heading, ['warn']],
					],
				},
				filename: 'test/fixtures/heading/error0.md',
				reporter: () => '',
			}, spinner);

			assert.equal(spinnerMethod, 'succeed');
			assert.equal(process.exitCode, 1);
		} finally {
			process.exitCode = previousExitCode;
		}
	});

	it('report respects warnings emitted through wrapper presets', async () => {
		const previousExitCode = process.exitCode;
		process.exitCode = 1;
		let spinnerMethod;
		const spinner = {
			succeed() {
				spinnerMethod = 'succeed';
			},
			fail() {
				spinnerMethod = 'fail';
			},
		};

		try {
			await lint._report({
				config: [remarkLint, headingWarnPreset],
				filename: 'test/fixtures/heading/error0.md',
				reporter: () => '',
			}, spinner);

			assert.equal(spinnerMethod, 'succeed');
			assert.equal(process.exitCode, 1);
		} finally {
			process.exitCode = previousExitCode;
		}
	});

	it('report respects custom error severity', async () => {
		const previousExitCode = process.exitCode;
		process.exitCode = undefined;
		let spinnerMethod;
		const spinner = {
			succeed() {
				spinnerMethod = 'succeed';
			},
			fail() {
				spinnerMethod = 'fail';
			},
		};

		try {
			await lint._report({
				config: [remarkLint, [spellCheck, ['error']]],
				filename: 'test/fixtures/spell-check/error0.md',
				reporter: () => '',
			}, spinner);

			assert.equal(spinnerMethod, 'fail');
			assert.equal(process.exitCode, 1);
		} finally {
			process.exitCode = previousExitCode;
		}
	});
});

/// import lint from '..';

// Because of https://github.com/avajs/ava/issues/2041
// TODO: Uncomment this when the issue is fixed
// it('main', async () => {
// 	assert.ok((await lint({filename: 'test/fixtures/main.md'})).messages.length > 0);
// });
//
// it('`reporter` option', async () => {
// 	let wasReporterCalled = false;
// 	const reporter = reports => {
// 		if (reports.length > 0) {
// 			wasReporterCalled = true;
// 		}
// 	};
//
// 	await lint.report({filename: 'test/fixtures/main.md', reporter});
//
// 	assert.ok(wasReporterCalled);
// });
