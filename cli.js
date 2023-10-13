#!/usr/bin/env node
import process from 'node:process';
import meow from 'meow';
import findReadmeFile from './lib/find-readme-file.js';
import awesomeLint from './index.js';

const getReporter = async name => {
	// Check if reporter is an npm package.
	try {
		const {report} = await import(name);
		return report;
	} catch (error) {
		if (error.code === 'MODULE_NOT_FOUND') {
			console.error(`No reporter found matching \`${name}\`. Using default reporter (vfile-reporter-pretty).`);
		} else {
			throw error;
		}
	}
};

const cli = meow(`
	Usage
	  $ awesome-lint [url|filename]

	Options
	  --reporter, -r  Use a custom reporter
`, {
	importMeta: import.meta,
	flags: {
		reporter: {
			type: 'string',
			shortFlag: 'r',
		},
	},
});

const input = cli.input[0];

const options = {};

options.filename = input ?? findReadmeFile(process.cwd());

const reporterName = cli.flags.reporter;
if (reporterName) {
	options.reporter = await getReporter(reporterName);
}

await awesomeLint.report(options);
