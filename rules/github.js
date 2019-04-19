'use strict';
const execa = require('execa');
const got = require('got');
const gh = require('github-url-to-object');
const rule = require('unified-lint-rule');

module.exports = rule('remark-lint:awesome/github', async (ast, file) => {
	const {dirname} = file;

	try {
		const remoteUrl = await execa.stdout('git', [
			'config',
			'--get',
			'remote.origin.url'
		], {
			cwd: dirname
		});
		const githubUrls = gh(remoteUrl);
		if (!githubUrls) {
			file.message('Repository should be on GitHub');
			return;
		}

		const headers = {
			Accept: 'application/vnd.github.mercy-preview+json',
			'User-Agent': 'awesome-lint'
		};
		if (process.env.github_token) {
			headers.Authorization = `token ${process.env.github_token}`;
		}

		const res = await got.get(githubUrls.api_url, {
			headers,
			json: true
		});

		const data = res.body;
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
	} catch (_) {
		// Most likely not a Git repository
		file.message('Awesome list must reside in a valid git repository');
	}
});

// For stubbing
module.exports.execa = execa;
module.exports.got = got;
