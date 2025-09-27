import api from './api';

export const getProjects = () => api.get('/projects/core');
export const getProjectById = (id) => api.get(`/projects/core/${id}`);
export const createProject = (data) => api.post('/projects/core', data);
export const updateProject = (id, data) => api.put(`/projects/core/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/core/${id}`);
