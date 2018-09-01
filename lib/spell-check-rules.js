'use strict';

module.exports = [
	{
		test: /\bnode\.?js\b/gi,
		value: 'Node.js'
	},
	{
		test: /\bStack\s?Overflow\b/gi,
		value: 'Stack Overflow'
	},
	{
		test: /\bjavascript\b/gi,
		value: 'JavaScript'
	},
	{
		test: [/\bmac\s?OS(?!\s?X)\b/gi, /(mac\s?)?OS\s?X/gi],
		value: 'macOS'
	},
	{
		test: /\bYou\s?Tube\b/gi,
		value: 'YouTube'
	},
	{
		test: /\bGit\s?Hub\b/gi,
		value: 'GitHub'
	},
	{
		test: /$.+\bopen\s?-?\s?source\b/gi,
		value: 'open source'
	},
	{
		test: /$\bopen\s?-?\s?source\b/gi,
		value: 'Open source'
	}
];
