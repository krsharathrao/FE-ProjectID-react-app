import api from './api';

export const getSegments = () => api.get('/Segments');
export const getSegmentById = (id) => api.get(`/Segments/${id}`);
export const createSegment = (data) => api.post('/Segments', data);
export const updateSegment = (id, data) => api.put(`/Segments/${id}`, data);
export const deleteSegment = (id) => api.delete(`/Segments/${id}`);
