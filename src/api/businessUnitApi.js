import api from './api';

export const getBusinessUnits = () => api.get('/BusinessUnits');
export const getBusinessUnitById = (id) => api.get(`/BusinessUnits/${id}`);
export const createBusinessUnit = (data) => api.post('/BusinessUnits', data);
export const updateBusinessUnit = (id, data) => api.put(`/BusinessUnits/${id}`, data);
export const deleteBusinessUnit = (id) => api.delete(`/BusinessUnits/${id}`);
