#!/usr/bin/env node
'use strict';
const meow = require('meow');
const awesomeLint = require('.');

const cli = meow(`
	Usage
	  $ awesome-lint
`);

awesomeLint.report({filename: cli.input[0] || 'readme.md'});
