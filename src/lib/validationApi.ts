export const getValidationApiBaseUrl = (): string | null => {
  const preferred = import.meta.env.VITE_VALIDATION_API_BASE_URL;
  const fallback = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

  const baseUrl =
    (typeof preferred === 'string' && preferred.trim().length > 0 ? preferred : undefined) ??
    (typeof fallback === 'string' && fallback.trim().length > 0 ? fallback : undefined);

  if (!baseUrl) return null;
  return baseUrl.trim().replace(/\/+$/, '');
};
