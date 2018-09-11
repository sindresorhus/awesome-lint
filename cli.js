#!/usr/bin/env node
'use strict';
const meow = require('meow');

const findReadmeFile = require('./lib/find-readme-file');
const awesomeLint = require('.');

const main = async () => {
	const cli = meow(`
		Usage
			$ awesome-lint
	`);

	const options = { };
	const input = cli.input[0];

	if (input) {
		options.filename = input;
	} else {
		options.filename = findReadmeFile(process.cwd());
	}

	await awesomeLint.report(options);
};

main();
