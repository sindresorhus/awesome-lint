import {execa} from 'execa';
import gh from 'github-url-to-object';
import {lintRule} from 'unified-lint-rule';
import {fetchGitHubData} from '../lib/github-api.js';

const githubRule = lintRule('remark-lint:awesome-github', async (ast, file) => {
	const {dirname, repoURL} = file;

	// Get the repository URL to fetch from GitHub API
	let targetRepoURL;
	if (repoURL) {
		targetRepoURL = repoURL;
	} else {
		// For local repos, get the remote URL from git
		try {
			const {stdout: gitBranch} = await execa('git', ['branch', '--show-current'], {cwd: dirname});

			let remoteName;
			if (gitBranch) {
				const {stdout} = await execa('git', ['config', '--get', `branch.${gitBranch}.remote`], {cwd: dirname});
				remoteName = stdout;
			} else {
				const {stdout} = await execa('git', [
					'config',
					'--default',
					'origin',
					'--get',
					'clone.defaultRemoteName',
				], {cwd: dirname});

				remoteName = stdout;
			}

			const {stdout: remoteUrl} = await execa('git', ['remote', 'get-url', '--push', remoteName], {cwd: dirname});
			targetRepoURL = remoteUrl;
		} catch {
			file.message('Awesome list must reside in a valid git repository');
			return;
		}
	}

	// Validate that it's a GitHub URL and fetch data
	if (!gh(targetRepoURL)) {
		file.message('Repository should be on GitHub');
		return;
	}

	// Use the GitHub API to check repository details
	const data = await fetchGitHubData(targetRepoURL);
	if (!data) {
		return;
	}

	if (!data.description) {
		file.message('The repository should have a description');
	}

	if (data.topics && !data.topics.includes('awesome')) {
		file.message('The repository should have "awesome" as a GitHub topic');
	}

	if (data.topics && !data.topics.includes('awesome-list')) {
		file.message('The repository should have "awesome-list" as a GitHub topic');
	}

	if (!data.license) {
		file.message('License was not detected by GitHub');
	}
});

export default githubRule;
