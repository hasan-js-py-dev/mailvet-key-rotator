export const getValidationApiBaseUrl = (): string | null => {
  const baseUrl = import.meta.env.VITE_VALIDATION_API_BASE_URL;
  if (typeof baseUrl === 'string' && baseUrl.trim().length > 0) {
    return baseUrl.replace(/\/$/, '');
  }
  return null;
};
