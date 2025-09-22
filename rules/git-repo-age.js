import {execa} from 'execa';
import {lintRule} from 'unified-lint-rule';
import {fetchGitHubData} from '../lib/github-api.js';

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const minimumRepositoryAgeDays = 30;

function formatRepositoryAgeMessage(repositoryAgeMilliseconds) {
	const daysOld = Math.floor(repositoryAgeMilliseconds / millisecondsPerDay);
	const daysLeft = minimumRepositoryAgeDays - daysOld;

	if (daysLeft <= 0) {
		return; // Repository is old enough
	}

	const daysText = daysLeft === 1 ? 'day' : 'days';
	return `Repository is ${daysOld} days old, but must be at least ${minimumRepositoryAgeDays} days old `
		+ `(${daysLeft} ${daysText} left). New repositories need time to mature before being added `
		+ 'to the main awesome list.';
}

function checkRepositoryAge(repositoryDate, file) {
	const now = new Date();
	const repositoryAgeMilliseconds = now - repositoryDate;

	const message = formatRepositoryAgeMessage(repositoryAgeMilliseconds);
	if (message !== undefined) {
		file.message(message);
	}
}

const gitRepoAgeRule = lintRule('remark-lint:awesome-git-repo-age', async (ast, file) => {
	const {dirname, repoURL} = file;

	// If we have a repoURL, use GitHub API to check repo age
	if (repoURL) {
		const data = await fetchGitHubData(repoURL);
		if (!data?.created_at) {
			return;
		}

		const repositoryCreationDate = new Date(data.created_at);
		checkRepositoryAge(repositoryCreationDate, file);
		return;
	}

	// For local repos, use git commands
	try {
		const {stdout: firstCommitHash} = await execa('git', [
			'rev-list',
			'--max-parents=0',
			'HEAD',
		], {
			cwd: dirname,
		});

		const {stdout: firstCommitDate} = await execa('git', [
			'show',
			'-s',
			'--format=%ci',
			firstCommitHash,
		], {
			cwd: dirname,
		});

		const repositoryCreationDate = new Date(firstCommitDate);
		checkRepositoryAge(repositoryCreationDate, file);
	} catch {
		file.message('Awesome list must reside in a valid deep-cloned Git repository (see https://github.com/sindresorhus/awesome-lint#tip for more information)');
	}
});

export default gitRepoAgeRule;
export {formatRepositoryAgeMessage};
