'use strict';
const remark = require('remark');
const globby = require('globby');
const pify = require('pify');
const toVfile = require('to-vfile');
const vfileReporterPretty = require('vfile-reporter-pretty');
const config = require('./config');

const m = opts => {
	opts = Object.assign({
		filename: 'readme.md'
	}, opts);

	const readmeFile = globby.sync(opts.filename, {nocase: true})[0];

	if (!readmeFile) {
		return Promise.reject(new Error(`Couldn't find the file ${opts.filename}`));
	}

	const run = remark().use(config).process;
	const file = toVfile.readSync(readmeFile);

	return pify(run)(file);
};

m.report = opts => m(opts).then(file => {
	const {messages} = file;

	if (messages.length === 0) {
		return;
	}

	messages.forEach(x => {
		x.fatal = true; // eslint-ignore-line TODO: because of https://github.com/wooorm/remark-lint/issues/65
	});

	process.exitCode = 1;

	console.log(vfileReporterPretty([file]));
});

module.exports = m;
