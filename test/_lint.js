import lint from '..';

export default async options => {
	const result = await lint(options);
	return result.messages.map(error => ({
		ruleId: error.ruleId,
		message: error.message
	}));
};
