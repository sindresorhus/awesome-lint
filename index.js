'use strict';
const remark = require('remark');
const globby = require('globby');
const pify = require('pify');
const toVfile = require('to-vfile');
const vfileReporterPretty = require('vfile-reporter-pretty');
const config = require('./config');

const m = options => {
	options = Object.assign({
		config,
		filename: 'readme.md'
	}, options);

	const readmeFile = globby.sync(options.filename, {nocase: true})[0];

	if (!readmeFile) {
		return Promise.reject(new Error(`Couldn't find the file ${options.filename}`));
	}

	const run = remark().use(options.config).process;
	const file = toVfile.readSync(readmeFile);

	return pify(run)(file);
};

m.report = async options => {
	const file = await m(options);
	const {messages} = file;

	if (messages.length === 0) {
		return;
	}

	for (const message of messages) {
		message.fatal = true; // TODO: because of https://github.com/wooorm/remark-lint/issues/65
	}

	process.exitCode = 1;

	console.log(vfileReporterPretty([file]));
};

module.exports = m;
