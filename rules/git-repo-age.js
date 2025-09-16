import {execa} from 'execa';
import {lintRule} from 'unified-lint-rule';
import {fetchGitHubData} from '../lib/github-api.js';

const oneDay = 24 * 60 * 60 * 1000;
const minGitRepoAgeDays = 30;
const minGitRepoAgeMs = minGitRepoAgeDays * oneDay;

const gitRepoAgeRule = lintRule('remark-lint:awesome-git-repo-age', async (ast, file) => {
	const {dirname, repoURL} = file;

	// If we have a repoURL, use GitHub API to check repo age
	if (repoURL) {
		const data = await fetchGitHubData(repoURL);
		if (!data?.created_at) {
			return;
		}

		const createdAt = new Date(data.created_at);
		const now = new Date();

		if (now - createdAt < minGitRepoAgeMs) {
			file.message(`Git repository must be at least ${minGitRepoAgeDays} days old`);
		}

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

		const date = new Date(firstCommitDate);
		const now = new Date();

		if (now - date < minGitRepoAgeMs) {
			file.message(`Git repository must be at least ${minGitRepoAgeDays} days old`);
		}
	} catch {
		file.message('Awesome list must reside in a valid deep-cloned Git repository (see https://github.com/sindresorhus/awesome-lint#tip for more information)');
	}
});

export default gitRepoAgeRule;
