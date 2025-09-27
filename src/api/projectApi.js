import api from './api';

export const getProjects = () => api.get('/projects');
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const generateProjectPID = (id) => api.post(`/projects/${id}/generate-pid`);
export const submitProjectForSuperAdminReview = (id) => api.post(`/projects/${id}/submit-for-superadmin-review`);

export const adminApproveProject = (id, remarks) => api.post(`/projects/${id}/admin-approve`, { remarks });
export const adminRejectProject = (id, remarks) => api.post(`/projects/${id}/admin-reject`, { remarks });

export const superadminApproveProject = (id, remarks) => api.post(`/projects/${id}/superadmin-approve`, { remarks });
export const superadminRejectProject = (id, remarks) => api.post(`/projects/${id}/superadmin-reject`, { remarks });
