'use strict';
const path = require('path');
const ora = require('ora');
const remark = require('remark');
const globby = require('globby');
const pify = require('pify');
const toVfile = require('to-vfile');
const vfileReporterPretty = require('vfile-reporter-pretty');
const config = require('./config');

const lint = options => {
	options = {
		config,
		filename: 'readme.md',
		...options
	};

	const readmeFile = globby.sync(options.filename, {nocase: true})[0];

	if (!readmeFile) {
		return Promise.reject(new Error(`Couldn't find the file ${options.filename}`));
	}

	const run = remark().use(options.config).process;
	const file = toVfile.readSync(path.resolve(readmeFile));

	return pify(run)(file);
};

lint.report = async options => {
	const spinner = ora('Linting').start();
	const file = await lint(options);
	const {messages} = file;

	if (messages.length === 0) {
		spinner.succeed();
		return;
	}

	for (const message of messages) {
		message.fatal = true; // TODO: because of https://github.com/wooorm/remark-lint/issues/65
	}

	spinner.fail();
	process.exitCode = 1;

	file.path = path.basename(file.path);
	console.log(vfileReporterPretty([file]));
};

module.exports = lint;
