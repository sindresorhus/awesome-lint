import test from 'ava';

test('x', t => {
	t.pass();
});

/// import lint from '..';

// Because of https://github.com/avajs/ava/issues/2041
// TODO: Uncomment this when the issue is fixed
// test('main', async t => {
// 	t.true((await lint({filename: 'test/fixtures/main.md'})).messages.length > 0);
// });
//
// test('`reporter` option', async t => {
// 	let wasReporterCalled = false;
// 	const reporter = reports => {
// 		if (reports.length > 0) {
// 			wasReporterCalled = true;
// 		}
// 	};
//
// 	await lint.report({filename: 'test/fixtures/main.md', reporter});
//
// 	t.true(wasReporterCalled);
// });
