#!/usr/bin/env node
'use strict';
const meow = require('meow');

const findReadmeFile = require('./lib/find-readme-file');
const awesomeLint = require('.');

const main = async () => {
	const cli = meow(`
		Usage
			$ awesome-lint <optional input filename>
		
		Options
			--reporter, -r Use a custom reporter
	`, {
		flags: {
			reporter: {
				type: 'string',
				alias: 'r'
			}
		}
	});

	const options = { };
	const input = cli.input[0];
	const reporterName = cli.flags.reporter;

	if (input) {
		options.filename = input;
	} else {
		options.filename = findReadmeFile(process.cwd());
	}

	if (reporterName) {
		// Check if reporter is an npm package
		try {
			options.reporter = require(reporterName).report;
		} catch (error) {
			if (error.code === 'MODULE_NOT_FOUND') {
				console.log(`No reporter found matching "${reporterName}". Proceeding with default reporter (vfile-reporter-pretty)`);
			} else {
				throw error;
			}
		}
	}

	await awesomeLint.report(options);
};

main();
