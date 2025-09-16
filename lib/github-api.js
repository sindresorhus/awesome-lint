import process from 'node:process';
import gh from 'github-url-to-object';

// Shared utility for making GitHub API calls
export const fetchGitHubData = async repoURL => {
	try {
		const githubUrls = gh(repoURL);
		if (!githubUrls) {
			return undefined;
		}

		const headers = {
			Accept: 'application/vnd.github.v3+json',
			'User-Agent': 'awesome-lint',
		};
		if (process.env.github_token) {
			headers.Authorization = `token ${process.env.github_token}`;
		}

		const response = await fetch(githubUrls.api_url, {headers});
		if (!response.ok) {
			return undefined;
		}

		return await response.json();
	} catch {
		return undefined;
	}
};
