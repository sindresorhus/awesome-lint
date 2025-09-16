import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import remarkLint from 'remark-lint';
import noUndefinedReferences from 'remark-lint-no-undefined-references';
import lint from '../_lint.js';

const config = {
	plugins: [
		remarkLint,
		[noUndefinedReferences, {allow: [/^!(?:note|tip|important|warning|caution)$/i]}], // Allow GitHub alerts
	],
};

describe('rules › github-alerts', () => {
	it('should not flag GitHub alerts as undefined references', async () => {
		const messages = await lint({config, filename: 'test/fixtures/github-alerts.md'});
		// Should not have any undefined reference errors for GitHub alerts
		const undefinedRefErrors = messages.filter(message => message.ruleId === 'no-undefined-references');
		assert.equal(undefinedRefErrors.length, 0);
	});
});
