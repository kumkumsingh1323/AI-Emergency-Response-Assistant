import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const getIncidents = () => api.get('/incidents').then(res => res.data);
export const getIncident = (id) => api.get(`/incidents/${id}`).then(res => res.data);
export const submitReport = (data) => api.post('/reports', data).then(res => res.data);
export const updateIncidentStatus = (id, data) => api.put(`/incidents/${id}`, data).then(res => res.data);
export const mergeIncidents = (sourceId, targetId) => api.post('/incidents/merge', { sourceId, targetId }).then(res => res.data);
