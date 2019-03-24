'use strict';

const emojiRegex = require('emoji-regex');

module.exports = text => {
	let match;
	let regex = emojiRegex();
	while ((match = regex.exec(text))) {
		const emoji = match[0];
		const codePoints = [...emoji].length;
		if (match.index === 0) {
			text = text.substr(codePoints).trim();
			regex = emojiRegex();
		} else if (match.index + codePoints === text.length) {
			text = text.substr(0, match.index).trim();
			regex = emojiRegex();
		}
	}

	return text;
};
