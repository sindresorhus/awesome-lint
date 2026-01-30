import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import config, {createConfig} from '../config.js';
import {createRules} from '../rules/index.js';

describe('api', () => {
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
