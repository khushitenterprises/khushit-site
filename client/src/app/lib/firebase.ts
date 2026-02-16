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
  const apiBase = import.meta.env.VITE_API_URL || '';

  const response = await fetch(`${apiBase}/api/registrations`, {
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
}
