import heading from './heading.js';
import badge from './badge.js';
import contributing from './contributing.js';
/// import gitRepoAge from './git-repo-age.js';
import github from './github.js';
import license from './license.js';
import listItem from './list-item.js';
import balancedPunctuation from './balanced-punctuation.js';
import noCiBadge from './no-ci-badge.js';
import noRepeatItemInDescription from './no-repeat-item-in-description.js';
import spellCheck from './spell-check.js';
import toc from './toc.js';
import doubleLink, {createAwesomeListIgnore} from './double-link.js';

// Factory function to create rules with project website configuration
const createRules = (options = {}) => {
	const {projectWebsite} = options;
	const ignoreUrls = [];

	// Add project website to ignore list if available
	if (projectWebsite) {
		ignoreUrls.push(projectWebsite);
	}

	const rules = [
		heading,
		badge,
		contributing,

		// Disabled for now as it means we cannot sparsely check out the repo.
		// gitRepoAge,

		github,
		license,
		listItem,
		balancedPunctuation,
		noCiBadge,
		noRepeatItemInDescription,
		spellCheck,
		toc,
		// Configure double-link with awesome-list behavior and project website ignoring
		[doubleLink, {
			ignore: ignoreUrls,
			shouldIgnore: createAwesomeListIgnore,
		}],
	];

	return rules;
};

// Default rules for backward compatibility
const rules = createRules();

export default rules;
export {createRules};
