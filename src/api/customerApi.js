import api from './api';

export const getCustomers = () => api.get('/Customer');
export const getCustomerById = (id) => api.get(`/Customer/${id}`);
export const createCustomer = (data) => api.post('/Customer', data);
export const updateCustomer = (id, data) => api.put(`/Customer/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/Customer/${id}`);
