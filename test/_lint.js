import lint from '../index.js';

const lintHelper = async options => {
	const results = await lint(options);

	let list = [];
	for (const file of results) {
		list = [...list, ...file.messages];
	}

	return list.map(error => ({
		line: error.line,
		ruleId: error.ruleId,
		message: error.message
	}));
};

export default lintHelper;
