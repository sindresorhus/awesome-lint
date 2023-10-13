import {lintRule} from 'unified-lint-rule';
import {visit} from 'unist-util-visit';

const noCiBadgeRule = lintRule('remark-lint:awesome-no-ci-badge', (ast, file) => {
	visit(ast, 'image', node => {
		if (/build status|travis|circleci/i.test(node.title)) {
			file.message('Readme must not contain CI badge', node);
		} else if (/travis|circleci/i.test(node.url)) {
			file.message('Readme must not contain CI badge', node);
		}
	});
});

export default noCiBadgeRule;
