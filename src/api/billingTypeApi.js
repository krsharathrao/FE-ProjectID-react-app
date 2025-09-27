import api from './api';

// GET all billing types
export const fetchBillingTypes = () => api.get('/BillingTypes');

// GET billing type by ID
export const fetchBillingTypeById = (id) => api.get(`/BillingTypes/${id}`);

// POST create new billing type
export const createBillingType = (data) => api.post('/BillingTypes', data);

// PUT update billing type
export const updateBillingType = (id, data) => api.put(`/BillingTypes/${id}`, data);

// DELETE billing type by ID
export const deleteBillingType = (id) => api.delete(`/BillingTypes/${id}`);
