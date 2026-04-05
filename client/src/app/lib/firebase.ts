import { buildApiUrl, getApiBaseCandidates } from '../../services/apiBase';

export type RegistrationPayload = {
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  source: 'page' | 'modal';
};

export async function saveRegistration(payload: RegistrationPayload) {
  const apiBases = getApiBaseCandidates();
  let lastError: unknown = null;

  for (const base of apiBases) {
    try {
      const response = await fetch(buildApiUrl(base, '/registrations'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to save registration');
      }

      return response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Failed to save registration');
}
