#!/usr/bin/env node
'use strict';
const gitClone = require('git-clone');
const isUrl = require('is-url-superb');
const meow = require('meow');
const pify = require('pify');
const rmfr = require('rmfr');
const tempy = require('tempy');

const findReadmeFile = require('./lib/find-readme-file');
const awesomeLint = require('.');

const main = async () => {
	const cli = meow(`
		Usage
			$ awesome-lint
	`);

	const options = { };
	const input = cli.input[0];
	let temp = null;

	if (input) {
		if (isUrl(input)) {
			temp = tempy.directory();
			await pify(gitClone)(input, temp);

			const readme = findReadmeFile(temp);
			if (!readme) {
				await rmfr(temp);
				throw new Error(`Unable to find valid readme for "${input}"`);
			}

			options.filename = readme;
		} else {
			options.filename = input;
		}
	} else {
		options.filename = 'readme.md';
	}

	await awesomeLint.report(options);

	if (temp) {
		await rmfr(temp);
	}
};

main();
