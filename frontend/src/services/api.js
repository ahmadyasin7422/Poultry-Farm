// API base URL - uses Vite proxy in development
const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get auth token from localStorage
 */
const getToken = () => localStorage.getItem('token');

/**
 * Generic fetch wrapper with JWT auth support
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  login: (credentials) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => apiFetch('/auth/me'),
};

// Dashboard & Reports API
export const dashboardAPI = {
  getStats: () => apiFetch('/dashboard'),
  getReports: (period = 'daily') => apiFetch(`/reports?period=${period}`),
};

// Generic CRUD API factory
const createCRUDAPI = (resource) => ({
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/${resource}${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiFetch(`/${resource}/${id}`),
  create: (data) =>
    apiFetch(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiFetch(`/${resource}/${id}`, {
      method: 'DELETE',
    }),
});

export const flockAPI = createCRUDAPI('flocks');
export const feedAPI = createCRUDAPI('feeds');
export const eggAPI = createCRUDAPI('eggs');
export const saleAPI = createCRUDAPI('sales');
export const expenseAPI = createCRUDAPI('expenses');
export const customerAPI = createCRUDAPI('customers');
