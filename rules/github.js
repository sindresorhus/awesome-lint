import process from 'node:process';
import {execa} from 'execa';
import gh from 'github-url-to-object';
import {lintRule} from 'unified-lint-rule';

const githubRule = lintRule('remark-lint:awesome-github', async (ast, file) => {
	const {dirname, repoURL} = file;
	let githubUrls;

	// If we have a repoURL, use it directly
	if (repoURL) {
		githubUrls = gh(repoURL);
		if (!githubUrls) {
			file.message('Repository should be on GitHub');
			return;
		}
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
			githubUrls = gh(remoteUrl);
			if (!githubUrls) {
				file.message('Repository should be on GitHub');
				return;
			}
		} catch {
			file.message('Awesome list must reside in a valid git repository');
			return;
		}
	}

	// Now use the GitHub API to check repository details
	const headers = {
		Accept: 'application/vnd.github.mercy-preview+json',
		'User-Agent': 'awesome-lint',
	};
	if (process.env.github_token) {
		headers.Authorization = `token ${process.env.github_token}`;
	}

	let data;
	try {
		const response = await fetch(githubUrls.api_url, {headers});
		if (!response.ok) {
			return;
		}

		data = await response.json();
	} catch {
		// Handle network errors
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
