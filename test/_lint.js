import lint from '..';

export default async options => {
	const result = await lint(options);
	return result.reduce((lst, file) => lst.concat(file.messages), []).map(error => ({
		ruleId: error.ruleId,
		message: error.message
	}));
};
