import m from '..';

export default async options => {
	const result = await m(options);
	return result.messages.map(err => ({
		ruleId: err.ruleId,
		message: err.message
	}));
};
