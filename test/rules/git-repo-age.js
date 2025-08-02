import {
	test, expect, beforeEach, afterEach,
} from 'vitest';
import sinon from 'sinon';
import lint from '../_lint.js';
import gitRepoAge from '../../rules/git-repo-age.js';

const config = {
	plugins: [gitRepoAge],
};

let sandbox;

beforeEach(() => {
	sandbox = sinon.createSandbox();
});

afterEach(() => {
	sandbox.restore();
});

test.fails('git-repo-age - error invalid git repo', async () => {
	const execaStub = sandbox.stub(gitRepoAge.execa, 'stdout');
	execaStub.throws(new Error('"git" command not found'));

	const messages = await lint({config, filename: 'test/fixtures/git-repo-age/0.md'});
	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-git-repo-age',
			message:
        'Awesome list must reside in a valid deep-cloned Git repository (see https://github.com/sindresorhus/awesome-lint#tip for more information)',
		},
	]);
});

test.fails('git-repo-age - error repo is not old enough', async () => {
	const execaStub = sandbox.stub(gitRepoAge.execa, 'stdout');

	execaStub
		.withArgs('git', ['rev-list', '--max-parents=0', 'HEAD'])
		.returns('14fc116c8ff54fc8a13c4a3b7527eb95fb87d400');

	execaStub
		.withArgs('git', ['show', '-s', '--format=%ci', '14fc116c8ff54fc8a13c4a3b7527eb95fb87d400'])
		.returns('2030-08-01 12:55:53 +0200');

	const messages = await lint({config, filename: 'test/fixtures/git-repo-age/0.md'});
	expect(messages).toEqual([
		{
			line: null,
			ruleId: 'awesome-git-repo-age',
			message: 'Git repository must be at least 30 days old',
		},
	]);
});

test.fails('git-repo-age - valid repo is old enough', async () => {
	const execaStub = sandbox.stub(gitRepoAge.execa, 'stdout');

	execaStub
		.withArgs('git', ['rev-list', '--max-parents=0', 'HEAD'])
		.returns('14fc116c8ff54fc8a13c4a3b7527eb95fb87d400');

	execaStub
		.withArgs('git', ['show', '-s', '--format=%ci', '14fc116c8ff54fc8a13c4a3b7527eb95fb87d400'])
		.returns('2016-08-01 12:55:53 +0200');

	const messages = await lint({config, filename: 'test/fixtures/git-repo-age/0.md'});
	expect(messages).toEqual([]);
});
