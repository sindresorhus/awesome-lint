import parseGitHubUrl from 'parse-github-url';
import {readPackageSync} from 'read-pkg';

export default function findAuthorName({repoURL, dirname}) {
	if (repoURL) {
		return parseGitHubUrl(repoURL).owner;
	}

	try {
		const json = readPackageSync({cwd: dirname});
		return parseGitHubUrl(json.repository.url).owner;
	} catch {}
}
