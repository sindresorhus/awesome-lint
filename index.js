'use strict';
const fs = require('fs');
const remark = require('remark');
const remarkLint = require('remark-lint');
const globby = require('globby');
const pify = require('pify');
const vfileReporter = require('vfile-reporter');
const config = require('./config');

const m = module.exports = opts => {
	opts = Object.assign({
		filename: 'readme.md'
	}, opts);

	const readmeFile = globby.sync(opts.filename, {nocase: true})[0];

	if (!readmeFile) {
		return Promise.reject(new Error(`Couldn't find the file ${opts.filename}`));
	}

	const run = remark().use(remarkLint, config).process;

	return pify(run)(fs.readFileSync(readmeFile, 'utf8'));
};

m.report = opts => m(opts).then(file => {
	const messages = file.messages;

	if (messages.length === 0) {
		return;
	}

	messages.forEach(x => {
		x.file = opts.filename; // TODO: figure out how to set the filename in the remark() options
		x.fatal = true; // TODO: because of https://github.com/wooorm/remark-lint/issues/65
	});

	process.exitCode = 1;

	console.log(vfileReporter(file));
});
