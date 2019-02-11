import test from 'ava';
import m from '..';

test('main', async t => {
	t.true((await m({filename: 'test/fixtures/main.md'})).messages.length > 0);
});

test('custom reporter', async t => {
	let reporterCalled = false;
	const customReporter = function (vFileArr) {
		if (vFileArr.length > 0) {
			reporterCalled = true;
		}
	};

	await m.report({filename: 'test/fixtures/main.md', reporter: customReporter});
	t.true(reporterCalled);
});
