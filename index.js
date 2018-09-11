'use strict';
const path = require('path');
const isUrl = require('is-url-superb');
const ora = require('ora');
const remark = require('remark');
const gitClone = require('git-clone');
const globby = require('globby');
const pify = require('pify');
const rmfr = require('rmfr');
const tempy = require('tempy');
const toVfile = require('to-vfile');
const vfileReporterPretty = require('vfile-reporter-pretty');
const config = require('./config');
const findReadmeFile = require('./lib/find-readme-file');

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
	let temp = null;

	if (isUrl(options.filename)) {
		temp = tempy.directory();
		await pify(gitClone)(options.filename, temp);

		const readme = findReadmeFile(temp);
		if (!readme) {
			await rmfr(temp);
			throw new Error(`Unable to find valid readme for "${options.filename}"`);
		}

		options.filename = readme;
	}

	const file = await lint(options);
	const {messages} = file;

	if (temp) {
		await rmfr(temp);
	}

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
