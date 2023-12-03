import process from 'node:process';
import {execa} from 'execa';
import got from 'got';
import gh from 'github-url-to-object';
import {lintRule} from 'unified-lint-rule';

const githubRule = lintRule('remark-lint:awesome-github', async (ast, file) => {
	const {dirname} = file;

	try {
		const {stdout: gitBranch} = await execa('git', ['branch', '--show-current']);

		let remoteName;
		if (gitBranch) {
			const {stdout} = await execa('git', ['config', '--get', `branch.${gitBranch}.remote`]);
			remoteName = stdout;
		} else {
			const {stdout} = await execa('git', [
				'config',
				'--default',
				'origin',
				'--get',
				'clone.defaultRemoteName',
			]);

			remoteName = stdout;
		}

		const {stdout: remoteUrl} = await execa('git', ['remote', 'get-url', '--push', remoteName], {cwd: dirname});
		const githubUrls = gh(remoteUrl);
		if (!githubUrls) {
			file.message('Repository should be on GitHub');
			return;
		}

		const headers = {
			Accept: 'application/vnd.github.mercy-preview+json',
			'User-Agent': 'awesome-lint',
		};
		if (process.env.github_token) {
			headers.Authorization = `token ${process.env.github_token}`;
		}

		let data;
		try {
			data = await got(githubUrls.api_url, {headers}).json();
		} catch {
			// Handle HTTP errors
			return;
		}

		if (!data.description) {
			file.message('The repository should have a description');
		}

		if (!data.topics.includes('awesome')) {
			file.message('The repository should have "awesome" as a GitHub topic');
		}

		if (!data.topics.includes('awesome-list')) {
			file.message('The repository should have "awesome-list" as a GitHub topic');
		}

		if (!data.license) {
			file.message('License was not detected by GitHub');
		}
	} catch {
		file.message('.git/ directory not found');
	}
});

export default githubRule;
