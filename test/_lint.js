import lint from '..';

const lintHelper = async options => {
	const results = await lint(options);

	let list = [];
	for (const file of results) {
		list = list.concat(file.messages);
	}

	return list.map(error => ({
		line: error.line,
		ruleId: error.ruleId,
		message: error.message
	}));
};

export default lintHelper;
