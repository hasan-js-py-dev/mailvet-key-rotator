let cachedClient;

async function getDodoClient() {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing DODO_PAYMENTS_API_KEY');
  }

  const mod = await import('dodopayments');
  const DodoPayments = mod.default || mod;

  cachedClient = new DodoPayments({
    bearerToken: apiKey,
  });

  return cachedClient;
}

module.exports = {
  getDodoClient,
};
