const { Resend } = require('resend');

let client = null;

const getClient = () => {
	if (client) return client;

	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		console.warn('[resend] Client not initialized (missing RESEND_API_KEY)');
		return null;
	}

	client = new Resend(apiKey);
	return client;
};

module.exports = {
	emails: {
		send: async (payload) => {
			const resend = getClient();
			if (!resend) {
				const error = new Error('Resend is not configured on the server');
				error.code = 'RESEND_NOT_CONFIGURED';
				throw error;
			}
			return resend.emails.send(payload);
		},
	},
};
