import test from 'ava';
import sinon from 'sinon';
import m from '../_lint';

const gitRepoAge = require('../../rules/git-repo-age');

const config = {
	plugins: [
		gitRepoAge
	]
};

let sandbox;

test.beforeEach(() => {
	sandbox = sinon.createSandbox();
});

test.afterEach.always(() => {
	sandbox.restore();
});

test.serial('git-repo-age - error invalid git repo', async t => {
	const shellSyncStub = sandbox.stub(gitRepoAge.execa, 'shellSync');

	shellSyncStub
		.throws(new Error('"git" command not found'));

	const messages = await m({config, filename: 'test/fixtures/git-repo-age/0.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/git-repo-age',
			message: 'Awesome list must reside in a valid git repository'
		}
	]);
});

test.serial('git-repo-age - error repo is not old enough', async t => {
	const shellSyncStub = sandbox.stub(gitRepoAge.execa, 'shellSync');

	shellSyncStub
		.withArgs('git rev-list --max-parents=0 HEAD')
		.returns({stdout: '14fc116c8ff54fc8a13c4a3b7527eb95fb87d400'});

	shellSyncStub
		.withArgs('git show -s --format=%ci "14fc116c8ff54fc8a13c4a3b7527eb95fb87d400"')
		.returns({stdout: '2030-08-01 12:55:53 +0200'});

	const messages = await m({config, filename: 'test/fixtures/git-repo-age/0.md'});
	t.deepEqual(messages, [
		{
			ruleId: 'awesome/git-repo-age',
			message: 'Git repository must be at least 30 days old'
		}
	]);
});

test.serial('git-repo-age - valid repo is old enough', async t => {
	const shellSyncStub = sandbox.stub(gitRepoAge.execa, 'shellSync');

	shellSyncStub
		.withArgs('git rev-list --max-parents=0 HEAD')
		.returns({stdout: '14fc116c8ff54fc8a13c4a3b7527eb95fb87d400'});

	shellSyncStub
		.withArgs('git show -s --format=%ci "14fc116c8ff54fc8a13c4a3b7527eb95fb87d400"')
		.returns({stdout: '2016-08-01 12:55:53 +0200'});

	const messages = await m({config, filename: 'test/fixtures/git-repo-age/0.md'});
	t.deepEqual(messages, []);
});
