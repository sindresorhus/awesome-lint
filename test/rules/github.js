import test from 'ava';
import sinon from 'sinon';
import lint from '../_lint';

const github = require('../../rules/github');

const config = {
	plugins: [
		github
	]
};

let sandbox;

test.beforeEach(() => {
	sandbox = sinon.createSandbox();
});

test.afterEach.always(() => {
	sandbox.restore();
});

test.serial('github - error invalid git repo', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');

	execaStub
		.throws(new Error('"git" command not found'));

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome-github',
			message: 'Awesome list must reside in a valid git repository'
		}
	]);
});

test.serial('github - repo without description and license', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');

	execaStub
		.withArgs('git', ['config', '--get', 'remote.origin.url'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.returns({
			body: {
				description: null,
				topics: ['awesome', 'awesome-list'],
				license: null
			}
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome-github',
			message: 'The repository should have a description'
		}, {
			ruleId: 'awesome-github',
			message: 'License was not detected by GitHub'
		}
	]);
});

test.serial('github - missing topic awesome-list', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');

	execaStub
		.withArgs('git', ['config', '--get', 'remote.origin.url'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.returns({
			body: {
				description: 'Awesome lint',
				topics: ['awesome'],
				license: {
					key: 'mit'
				}
			}
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome-github',
			message: 'The repository should have "awesome-list" as a GitHub topic'
		}
	]);
});

test.serial('github - missing topic awesome', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');

	execaStub
		.withArgs('git', ['config', '--get', 'remote.origin.url'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.returns({
			body: {
				description: 'Awesome lint',
				topics: ['awesome-list'],
				license: {
					key: 'mit'
				}
			}
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome-github',
			message: 'The repository should have "awesome" as a GitHub topic'
		}
	]);
});

test.serial('github - remote origin is an GitLab repo', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');

	execaStub
		.withArgs('git', ['config', '--get', 'remote.origin.url'])
		.returns('https://gitlab.com/sindresorhus/awesome-lint-test.git');

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome-github',
			message: 'Repository should be on GitHub'
		}
	]);
});
