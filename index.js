import process from 'node:process';
import path from 'node:path';
import isUrl from 'is-url-superb';
import isGithubUrl from 'is-github-url';
import ora from 'ora';
import {remark} from 'remark';
import {globbySync} from 'globby';
import rmfr from 'rmfr';
import {temporaryDirectory} from 'tempy';
import {readSync as readVFileSync} from 'to-vfile';
import vfileReporterPretty from 'vfile-reporter-pretty';
import {execa} from 'execa';
import config, {createConfig} from './config.js';
import {createRules} from './rules/index.js';
import {fetchGitHubData} from './lib/github-api.js';
import findReadmeFile from './lib/find-readme-file.js';
import codeOfConductRule from './rules/code-of-conduct.js';

const ruleIdFromPlugin = plugin => plugin?.name?.replace(/^remark-lint:/, '');

const getConfiguredPlugins = config => Array.isArray(config) ? config : (config?.plugins ?? []);

const getDirectRuleIds = config => {
	const ruleIds = new Set();

	for (const plugin of getConfiguredPlugins(config)) {
		const rule = Array.isArray(plugin) ? plugin[0] : plugin;
		const ruleId = ruleIdFromPlugin(rule);

		if (ruleId) {
			ruleIds.add(ruleId);
		}
	}

	return ruleIds;
};

const getWarnRuleIds = config => {
	const warnRuleIds = new Set();

	for (const plugin of getConfiguredPlugins(config)) {
		if (!Array.isArray(plugin)) {
			continue;
		}

		const [rule, options] = plugin;
		if (!Array.isArray(options) || options[0] !== 'warn') {
			continue;
		}

		const ruleId = ruleIdFromPlugin(rule);
		if (ruleId) {
			warnRuleIds.add(ruleId);
		}
	}

	return warnRuleIds;
};

const resolveOptions = async options => {
	let projectWebsite;
	if (options.repoURL && !options.config) {
		const data = await fetchGitHubData(options.repoURL);
		projectWebsite = data?.homepage;
	}

	return {
		...options,
		config: options.config ?? (options.repoURL ? createConfig(createRules({repoURL: options.repoURL, projectWebsite})) : config),
		filename: options.filename ?? 'readme.md',
	};
};

const lint = async options => {
	options = await resolveOptions(options);

	const readmeFile = globbySync(options.filename.replaceAll('\\', '/'), {caseSensitiveMatch: false})[0];

	if (!readmeFile) {
		throw new Error(`Couldn't find the file ${options.filename}`);
	}

	const readmeVFile = readVFileSync(path.resolve(readmeFile));
	const {dirname} = readmeVFile;
	readmeVFile.repoURL = options.repoURL; // Pass repoURL to all rules
	const processTasks = [{
		vfile: readmeVFile,
		plugins: options.config,
	}];

	const codeOfConductFile = globbySync(['{code-of-conduct,code_of_conduct}.md', '.github/{code-of-conduct,code_of_conduct}.md'], {caseSensitiveMatch: false, cwd: dirname})[0];
	if (codeOfConductFile) {
		const codeOfConductVFile = readVFileSync(path.resolve(dirname, codeOfConductFile));
		codeOfConductVFile.repoURL = options.repoURL;
		processTasks.push({
			vfile: codeOfConductVFile,
			plugins: [[codeOfConductRule, ['error']]],
		});
	}

	return Promise.all(processTasks.map(({vfile, plugins}) => remark().use(plugins).process(vfile)));
};

lint.report = async options => {
	const spinner = ora('Linting').start();

	try {
		await lint._report(options, spinner);
	} catch (error) {
		spinner.fail(error.message);
		process.exitCode = 1;
	}
};

lint._report = async (options, spinner) => {
	let temporary = null;

	if (isUrl(options.filename)) {
		if (!isGithubUrl(options.filename, {repository: true})) {
			throw new Error(`Invalid GitHub repo URL: ${options.filename}`);
		}

		temporary = temporaryDirectory();
		await execa('git', ['clone', '--depth', '1', '--', options.filename, temporary]);

		const readme = findReadmeFile(temporary);
		if (!readme) {
			await rmfr(temporary);
			throw new Error(`Unable to find valid readme for "${options.filename}"`);
		}

		options.repoURL = options.filename;
		options.filename = readme;
	}

	// Resolve here so we can inspect the final config for severity classification. `lint()` calls `resolveOptions` again, but it's a no-op once `config` is set.
	options = await resolveOptions(options);
	const vfiles = await lint(options);
	const directRuleIds = getDirectRuleIds(options.config);
	const warnRuleIds = getWarnRuleIds(options.config);
	const messages = [];
	for (const vfile of vfiles) {
		vfile.path = path.basename(vfile.path);
		messages.push(...vfile.messages);
	}

	if (temporary) {
		await rmfr(temporary);
	}

	if (messages.length === 0) {
		spinner.succeed();

		if (options.reporter) {
			console.log(options.reporter([]));
		}

		return;
	}

	/*
	Classify each message as error or warning.

	remark-lint defaults a rule's severity to warn (`fatal: false`) when no severity is passed, so a plain `[plugin]` entry would pass-through as non-fatal. To preserve the historical "any violation fails the run" behavior, any message from a rule configured directly at the top level is treated as an error unless it was explicitly given `['warn']`. Messages from transitive rules (pulled in via presets) are left as warnings.

	- `fatal === true`: always an error (plugin called `file.fail`, or severity was `['error']`).
	- Rule in `warnRuleIds`: explicit `['warn']` — warning.
	- `fatal === false` and rule not in our top-level config: transitive — warning.
	- Otherwise (direct rule, non-fatal message): error.
	*/
	const hasErrors = messages.some(message => {
		if (message.fatal === true) {
			return true;
		}

		if (warnRuleIds.has(message.ruleId)) {
			return false;
		}

		if (message.fatal === false && !directRuleIds.has(message.ruleId)) {
			return false;
		}

		return true;
	});

	if (hasErrors) {
		spinner.fail();
		process.exitCode = 1;
	} else {
		spinner.succeed();
	}

	const reporter = options.reporter || vfileReporterPretty;
	console.log(reporter(vfiles));
};

export default lint;
