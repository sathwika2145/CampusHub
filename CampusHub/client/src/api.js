
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function request(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...options.headers
  };

  const response = await fetch(`${API}${path}`, {
    credentials: 'include',
    ...options,
    headers
  });

  const data =
    response.status === 204
      ? null
      : await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed (${response.status})`
    );
  }

  return data;
}

export const api = {
  // Authentication
  me: () => request('/auth/me'),

  login: body =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  register: body =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  logout: () =>
    request('/auth/logout', {
      method: 'POST'
    }),

  // Dashboard and general data
  dashboard: () => request('/dashboard'),

  list: (key, query = '') => request(`/${key}${query}`),

  create: (key, body) =>
    request(`/${key}`, {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  // Club management (Admin only)
  createClub: body =>
    request('/clubs', {
      method: 'POST',
      body: JSON.stringify(body)
    }),
    patch: (key, id, body) =>
  request(`/${key}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body)
  }),
  updateClub: (id, body) =>
    request(`/clubs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }),

  deleteClub: id =>
    request(`/clubs/${id}`, {
      method: 'DELETE'
    }),

  // Event management
  createEvent: formData =>
    request('/events', {
      method: 'POST',
      body: formData
    }),

  // General delete
  remove: (key, id) =>
    request(`/${key}/${id}`, {
      method: 'DELETE'
    }),

  // Club membership
  joinClub: id =>
    request(`/clubs/${id}/join`, {
      method: 'POST'
    }),

  // Event registration
  registerEvent: id =>
    request(`/events/${id}/register`, {
      method: 'POST'
    }),

  cancelEvent: id =>
    request(`/events/${id}/register`, {
      method: 'DELETE'
    }),

  // Academic resources
  uploadResource: form =>
    request('/resources', {
      method: 'POST',
      body: form
    }),

  // Admin user management
  adminUsers: () => request('/admin/users')
};
