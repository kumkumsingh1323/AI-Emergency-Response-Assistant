import axios from 'axios';
import { MOCK_INCIDENTS } from './mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
// Falls back to mock data if the backend is unreachable (demo / GitHub Pages).

const withMockFallback = async (apiFn, fallbackFn) => {
  try {
    return await apiFn();
  } catch {
    console.warn('[API] Backend unreachable – using mock data for demo.');
    return fallbackFn();
  }
};

// ─── API Exports ──────────────────────────────────────────────────────────────

export const getIncidents = () =>
  withMockFallback(
    () => api.get('/incidents').then(res => res.data),
    () => MOCK_INCIDENTS
  );

export const getIncident = (id) =>
  withMockFallback(
    () => api.get(`/incidents/${id}`).then(res => res.data),
    () => {
      const found = MOCK_INCIDENTS.find(i => i._id === id);
      if (!found) throw new Error(`Incident ${id} not found in mock data`);
      return found;
    }
  );

export const submitReport = (data) =>
  withMockFallback(
    () => api.post('/reports', data).then(res => res.data),
    () => ({ success: true, message: 'Report logged (demo mode)', data })
  );

export const updateIncidentStatus = (id, data) =>
  withMockFallback(
    () => api.put(`/incidents/${id}`, data).then(res => res.data),
    () => ({ ...MOCK_INCIDENTS.find(i => i._id === id), ...data })
  );

export const mergeIncidents = (sourceId, targetId) =>
  withMockFallback(
    () => api.post('/incidents/merge', { sourceId, targetId }).then(res => res.data),
    () => ({ success: true, message: 'Merge simulated (demo mode)', sourceId, targetId })
  );
