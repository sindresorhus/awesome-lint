import process from 'node:process';
import {
	test, expect, beforeEach, afterEach,
} from 'vitest';
import sinon from 'sinon';
import lint from '../_lint.js';
import github from '../../rules/github.js';

const config = {
	plugins: [github],
};

let sandbox;

beforeEach(() => {
	sandbox = sinon.createSandbox();
});

afterEach(() => {
	sandbox.restore();
});

test.fails('github - error invalid git repo', async () => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	execaStub.throws(new Error('"git" command not found'));

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'Awesome list must reside in a valid git repository',
		},
	]);
});

test.fails('github - repo without description and license', async () => {
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
				license: null,
			},
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'The repository should have a description',
		},
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'License was not detected by GitHub',
		},
	]);
});

test.fails('github - missing topic awesome-list', async () => {
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
				license: {key: 'mit'},
			},
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'The repository should have "awesome-list" as a GitHub topic',
		},
	]);
});

test.fails('github - missing topic awesome', async () => {
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
				license: {key: 'mit'},
			},
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'The repository should have "awesome" as a GitHub topic',
		},
	]);
});

test.fails('github - remote origin is a GitLab repo', async () => {
	const execaStub = sandbox.stub(github.execa, 'stdout');

	execaStub
		.withArgs('git', ['remote', 'get-url', '--push', 'origin'])
		.returns('https://gitlab.com/sindresorhus/awesome-lint-test.git');

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'Repository should be on GitHub',
		},
	]);
});

test.fails('github - invalid token', async () => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');

	execaStub
		.withArgs('git', ['remote', 'get-url', '--push', 'origin'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.rejects({statusCode: 401});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'Unauthorized access or token is invalid',
		},
	]);
});

test.fails('github - API rate limit exceeded with token', async () => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');
	process.env.github_token = 'abcd';

	execaStub
		.withArgs('git', ['remote', 'get-url', '--push', 'origin'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.rejects({
			statusCode: 403,
			headers: {
				'x-ratelimit-limit': 5000,
			},
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'API rate limit of 5000 requests per hour exceeded',
		},
	]);

	delete process.env.github_token;
});

test.fails('github - API rate limit exceeded without token', async () => {
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
				'x-ratelimit-limit': 60,
			},
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'API rate limit of 60 requests per hour exceeded. Use a personal token to increase the number of requests',
		},
	]);
});

test.fails('github - API offline', async () => {
	const execaStub = sandbox.stub(github.execa, 'stdout');
	const gotStub = sandbox.stub(github.got, 'get');

	execaStub
		.withArgs('git', ['remote', 'get-url', '--push', 'origin'])
		.returns('git@github.com:sindresorhus/awesome-lint-test.git');

	gotStub
		.withArgs('https://api.github.com/repos/sindresorhus/awesome-lint-test')
		.rejects({
			message: 'getaddrinfo ENOTFOUND api.github.com api.github.com:443',
			code: 'ENOTFOUND',
		});

	const messages = await lint({config, filename: 'test/fixtures/github/0.md'});
	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'There was a problem trying to connect to GitHub: getaddrinfo ENOTFOUND api.github.com api.github.com:443',
		},
	]);
});
