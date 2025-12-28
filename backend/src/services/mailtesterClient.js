const DEFAULT_BASE_URL = 'https://happy.mailtester.ninja/ninja';

const getMailtesterBaseUrl = () => {
  const configured = process.env.MAILTESTER_API_BASE_URL;
  if (typeof configured === 'string' && configured.trim().length > 0) {
    return configured.trim().replace(/\/+$/, '');
  }
  return DEFAULT_BASE_URL;
};

const verifyEmailWithMailtester = async (email, key) => {
  const baseUrl = getMailtesterBaseUrl();
  const url = new URL(baseUrl);
  url.searchParams.set('email', email);
  url.searchParams.set('key', key);

  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available. Please run on Node 18+ or add a fetch polyfill.');
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  const text = await res.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = { raw: text };
  }

  if (!res.ok) {
    const error = new Error(`MailTester request failed (${res.status})`);
    error.statusCode = 502;
    error.details = payload;
    throw error;
  }

  return payload;
};

module.exports = {
  verifyEmailWithMailtester,
};
