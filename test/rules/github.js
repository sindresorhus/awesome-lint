import process from 'node:process';
import {test, expect} from 'vitest';
import esmock from 'esmock';
import lint from '../_lint.js';

const filename = 'test/fixtures/github/0.md';

test.fails('github - error invalid git repo', async () => {
	const github = await esmock('../../rules/github.js', {
		execa: {
			stdout() {
				throw new Error('"git" command not found');
			},
		},
	});

	const config = {plugins: [github]};
	const messages = await lint({config, filename});

	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'Awesome list must reside in a valid git repository',
		},
	]);
});

test.fails('github - repo without description and license', async () => {
	const github = await esmock('../../rules/github.js', {
		execa: {
			stdout: () => 'git@github.com:sindresorhus/awesome-lint-test.git',
		},
		got: {
			get: async () => ({
				body: {
					description: null,
					topics: ['awesome', 'awesome-list'],
					license: null,
				},
			}),
		},
	});

	const config = {plugins: [github]};
	const messages = await lint({config, filename});

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
	const github = await esmock('../../rules/github.js', {
		execa: {
			stdout: () => 'git@github.com:sindresorhus/awesome-lint-test.git',
		},
		got: {
			get: async () => ({
				body: {
					description: 'Awesome lint',
					topics: ['awesome'],
					license: {key: 'mit'},
				},
			}),
		},
	});

	const config = {plugins: [github]};
	const messages = await lint({config, filename});

	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'The repository should have "awesome-list" as a GitHub topic',
		},
	]);
});

test.fails('github - missing topic awesome', async () => {
	const github = await esmock('../../rules/github.js', {
		execa: {
			stdout: () => 'git@github.com:sindresorhus/awesome-lint-test.git',
		},
		got: {
			get: async () => ({
				body: {
					description: 'Awesome lint',
					topics: ['awesome-list'],
					license: {key: 'mit'},
				},
			}),
		},
	});

	const config = {plugins: [github]};
	const messages = await lint({config, filename});

	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'The repository should have "awesome" as a GitHub topic',
		},
	]);
});

test.fails('github - remote origin is a GitLab repo', async () => {
	const github = await esmock('../../rules/github.js', {
		execa: {
			stdout: () => 'https://gitlab.com/sindresorhus/awesome-lint-test.git',
		},
	});

	const config = {plugins: [github]};
	const messages = await lint({config, filename});

	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'Repository should be on GitHub',
		},
	]);
});

test.fails('github - invalid token', async () => {
	const github = await esmock('../../rules/github.js', {
		execa: {
			stdout: () => 'git@github.com:sindresorhus/awesome-lint-test.git',
		},
		got: {
			async get() {
				throw {statusCode: 401};
			},
		},
	});

	const config = {plugins: [github]};
	const messages = await lint({config, filename});

	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'Unauthorized access or token is invalid',
		},
	]);
});

test.fails('github - API rate limit exceeded with token', async () => {
	process.env.github_token = 'abcd';

	const github = await esmock('../../rules/github.js', {
		execa: {
			stdout: () => 'git@github.com:sindresorhus/awesome-lint-test.git',
		},
		got: {
			async get() {
				throw {
					statusCode: 403,
					headers: {
						'x-ratelimit-limit': 5000,
					},
				};
			},
		},
	});

	const config = {plugins: [github]};
	const messages = await lint({config, filename});

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
	const github = await esmock('../../rules/github.js', {
		execa: {
			stdout: () => 'git@github.com:sindresorhus/awesome-lint-test.git',
		},
		got: {
			async get() {
				throw {
					statusCode: 403,
					headers: {
						'x-ratelimit-limit': 60,
					},
				};
			},
		},
	});

	const config = {plugins: [github]};
	const messages = await lint({config, filename});

	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'API rate limit of 60 requests per hour exceeded. Use a personal token to increase the number of requests',
		},
	]);
});

test.fails('github - API offline', async () => {
	const github = await esmock('../../rules/github.js', {
		execa: {
			stdout: () => 'git@github.com:sindresorhus/awesome-lint-test.git',
		},
		got: {
			async get() {
				throw {
					message: 'getaddrinfo ENOTFOUND api.github.com api.github.com:443',
					code: 'ENOTFOUND',
				};
			},
		},
	});

	const config = {plugins: [github]};
	const messages = await lint({config, filename});

	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-github',
			message: 'There was a problem trying to connect to GitHub: getaddrinfo ENOTFOUND api.github.com api.github.com:443',
		},
	]);
});
