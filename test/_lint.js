import lint from '..';

export default async options => {
	const result = await lint(options);
	return result.reduce((list, file) => list.concat(file.messages), []).map(error => ({
		line: error.line,
		ruleId: error.ruleId,
		message: error.message
	}));
};
