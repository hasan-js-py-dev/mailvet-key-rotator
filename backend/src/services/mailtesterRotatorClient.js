const DEFAULT_ROTATOR_URL = 'https://api.daddy-leads.com/mailtester/key/available';

const getRotatorUrl = () => {
  const configured = process.env.MAILTESTER_ROTATOR_URL;
  if (typeof configured === 'string' && configured.trim().length > 0) {
    return configured.trim();
  }

  // Backwards-compatible: allow specifying the key manager base URL.
  // Example: KEY_MANAGER_URL=http://localhost:4000
  const base = process.env.KEY_MANAGER_URL;
  if (typeof base === 'string' && base.trim().length > 0) {
    return base.trim().replace(/\/+$/, '') + '/mailtester/key/available';
  }

  return DEFAULT_ROTATOR_URL;
};

const stripBraces = (value) => String(value || '').replace(/[{}]/g, '').trim();

const getRotatorAuthHeaders = () => {
  const bearer = process.env.MAILTESTER_ROTATOR_TOKEN || process.env.KEY_MANAGER_TOKEN;
  const apiKey = process.env.MAILTESTER_ROTATOR_API_KEY || process.env.KEY_MANAGER_API_KEY;

  const headers = {};

  if (typeof bearer === 'string' && bearer.trim().length > 0) {
    headers.Authorization = `Bearer ${bearer.trim()}`;
  }

  if (typeof apiKey === 'string' && apiKey.trim().length > 0) {
    headers['x-api-key'] = apiKey.trim();
  }

  return headers;
};

const getAvailableMailtesterKey = async () => {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available. Please run on Node 18+ or add a fetch polyfill.');
  }

  const url = getRotatorUrl();
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json', ...getRotatorAuthHeaders() },
  });

  const text = await res.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = { raw: text };
  }

  if (!res.ok) {
    // Pass through common "wait" shape from rotator microservice.
    const err = new Error(payload?.error || `Key rotator request failed (${res.status})`);
    err.statusCode = res.status;
    err.details = payload;
    throw err;
  }

  const subscriptionId = String(payload?.subscriptionId || '').trim();
  const apiKey = stripBraces(subscriptionId);

  if (!apiKey) {
    const err = new Error('Key rotator returned an empty subscriptionId');
    err.statusCode = 502;
    err.details = payload;
    throw err;
  }

  return {
    subscriptionId,
    apiKey,
    plan: payload?.plan,
    avgRequestIntervalMs: payload?.avgRequestIntervalMs,
    lastUsed: payload?.lastUsed,
    nextRequestAllowedAt: payload?.nextRequestAllowedAt,
    nextRequestInMs: payload?.nextRequestInMs,
    raw: payload,
  };
};

module.exports = {
  getAvailableMailtesterKey,
};
