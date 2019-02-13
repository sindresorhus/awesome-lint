import test from 'ava';
import m from '..';

test('main', async t => {
	t.true((await m({filename: 'test/fixtures/main.md'})).messages.length > 0);
});

test('`reporter` option', async t => {
	let wasReporterCalled = false;
	const reporter = reports => {
		if (reports.length > 0) {
			wasReporterCalled = true;
		}
	};

	await m.report({filename: 'test/fixtures/main.md', reporter});
	t.true(wasReporterCalled);
});
