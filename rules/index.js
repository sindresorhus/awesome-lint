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
		[heading, ['error']],
		[badge, ['error']],
		[contributing, ['error']],

		// Disabled for now as it means we cannot sparsely check out the repo.
		// gitRepoAge,

		[github, ['error']],
		[license, ['error']],
		[listItem, ['error']],
		[balancedPunctuation, ['error']],
		[noCiBadge, ['error']],
		[noRepeatItemInDescription, ['error']],
		[spellCheck, ['warn']], // Spell-check violations are warnings, not errors
		[toc, ['error']],
		// Configure double-link with awesome-list behavior and project website ignoring
		[doubleLink, ['error', {
			ignore: ignoreUrls,
			shouldIgnore: createAwesomeListIgnore,
		}]],
	];

	return rules;
};

// Default rules used when no repo URL is provided
const rules = createRules();

export default rules;
export {createRules};
