import heading from './heading.js';
import badge from './badge.js';
import contributing from './contributing.js';
/// import gitRepoAge from './git-repo-age.js';
import github from './github.js';
import license from './license.js';
import listItem from './list-item.js';
import noCiBadge from './no-ci-badge.js';
import spellCheck from './spell-check.js';
import toc from './toc.js';
import doubleLink from './double-link.js';

const rules = [
	heading,
	badge,
	contributing,

	// Disabled for now as it means we cannot sparsely check out the repo.
	// gitRepoAge,

	github,
	license,
	listItem,
	noCiBadge,
	spellCheck,
	toc,
	doubleLink,
];

export default rules;
