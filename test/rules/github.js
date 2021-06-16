import test from 'ava';
import sinon from 'sinon';
import lint from '../_lint.js';

const github = require('../../rules/github.js');

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
			line: null,
			ruleId: 'awesome-github',
			message: 'Awesome list must reside in a valid git repository'
		}
	]);
});

test.serial('github - repo without description and license', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');

	execaStub
		.withArgs('git', ['remote', 'get-url', '--push', 'origin'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.resolves({
			body: {
				description: null,
				topics: ['awesome', 'awesome-list'],
				license: null
			}
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	t.deepEqual(messages, [
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'The repository should have a description'
		}, {
			line: null,
			ruleId: 'awesome-github',
			message: 'License was not detected by GitHub'
		}
	]);
});

test.serial('github - missing topic awesome-list', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');

	execaStub
		.withArgs('git', ['remote', 'get-url', '--push', 'origin'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.resolves({
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
			line: null,
			ruleId: 'awesome-github',
			message: 'The repository should have "awesome-list" as a GitHub topic'
		}
	]);
});

test.serial('github - missing topic awesome', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');

	execaStub
		.withArgs('git', ['remote', 'get-url', '--push', 'origin'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.resolves({
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
			line: null,
			ruleId: 'awesome-github',
			message: 'The repository should have "awesome" as a GitHub topic'
		}
	]);
});

test.serial('github - remote origin is an GitLab repo', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');

	execaStub
		.withArgs('git', ['remote', 'get-url', '--push', 'origin'])
		.returns('https://gitlab.com/sindresorhus/awesome-lint-test.git');

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	t.deepEqual(messages, [
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'Repository should be on GitHub'
		}
	]);
});

test.serial('github - invalid token', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');

	execaStub
		.withArgs('git', ['remote', 'get-url', '--push', 'origin'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.rejects({
			statusCode: 401
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	t.deepEqual(messages, [
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'Unauthorized access or token is invalid'
		}
	]);
});

test.serial('github - API rate limit exceeded with token', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');
	// eslint-disable-next-line camelcase
	process.env.github_token = 'abcd';

	execaStub
		.withArgs('git', ['remote', 'get-url', '--push', 'origin'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.rejects({
			statusCode: 403,
			headers: {
				'x-ratelimit-limit': 5000
			}
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	t.deepEqual(messages, [
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'API rate limit of 5000 requests per hour exceeded'
		}
	]);

	delete process.env.github_token;
});

test.serial('github - API rate limit exceeded without token', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');

	execaStub
		.withArgs('git', ['remote', 'get-url', '--push', 'origin'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.rejects({
			statusCode: 403,
			headers: {
				'x-ratelimit-limit': 60
			}
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	t.deepEqual(messages, [
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'API rate limit of 60 requests per hour exceeded. Use a personal token to increase the number of requests'
		}
	]);
});

test.serial('github - API offline', async t => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');

	execaStub
		.withArgs('git', ['remote', 'get-url', '--push', 'origin'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.rejects({
			message: 'getaddrinfo ENOTFOUND api.github.com api.github.com:443',
			code: 'ENOTFOUND'
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	t.deepEqual(messages, [
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'There was a problem trying to connect to GitHub: getaddrinfo ENOTFOUND api.github.com api.github.com:443'
		}
	]);
});
