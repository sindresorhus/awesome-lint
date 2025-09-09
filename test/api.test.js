import {describe, it} from 'node:test';
import assert from 'node:assert/strict';

describe('api', () => {
	it('x', () => {
		assert.ok(true);
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
