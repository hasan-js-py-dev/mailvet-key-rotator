const DEFAULT_ROTATOR_URL = 'https://api.daddy-leads.com/mailtester/key/available';

const getRotatorUrl = () => {
  const configured = process.env.MAILTESTER_ROTATOR_URL;
  if (typeof configured === 'string' && configured.trim().length > 0) {
    return configured.trim();
  }
  return DEFAULT_ROTATOR_URL;
};

const stripBraces = (value) => String(value || '').replace(/[{}]/g, '').trim();

const getAvailableMailtesterKey = async () => {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available. Please run on Node 18+ or add a fetch polyfill.');
  }

  const url = getRotatorUrl();
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
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
