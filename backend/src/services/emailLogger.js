/**
 * In-memory email log store for admin diagnostics.
 * Keeps the last N email send attempts.
 */

const MAX_LOGS = 100;
const logs = [];

const maskEmail = (email = '') => {
  if (!email || typeof email !== 'string' || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  const safeLocal = local || '';
  const maskedLocal = safeLocal.length <= 2
    ? `${safeLocal.slice(0, 1)}*`
    : `${safeLocal.slice(0, 2)}***`;
  return `${maskedLocal}@${domain}`;
};

const addLog = (entry) => {
  const log = {
    ...entry,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(log);
  if (logs.length > MAX_LOGS) {
    logs.pop();
  }
  return log;
};

const logSuccess = ({ type, to, from, subject, id }) => {
  const entry = addLog({
    status: 'success',
    type,
    to: maskEmail(to),
    from,
    subject,
    resendId: id,
  });
  console.info('[email] sent', entry);
  return entry;
};

const logFailure = ({ type, to, from, subject, error }) => {
  const entry = addLog({
    status: 'failed',
    type,
    to: maskEmail(to),
    from,
    subject,
    error: typeof error === 'string' ? error : error?.message || String(error),
  });
  console.error('[email] failed', entry);
  return entry;
};

const getLogs = (limit = 50) => {
  return logs.slice(0, Math.min(limit, MAX_LOGS));
};

const clearLogs = () => {
  logs.length = 0;
};

module.exports = {
  logSuccess,
  logFailure,
  getLogs,
  clearLogs,
};
