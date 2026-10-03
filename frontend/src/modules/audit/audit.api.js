import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const auditApi = {
  getLogs: (params) => apiClient.get(ENDPOINTS.AUDIT_LOGS, { params }),
  logAction: (data) => apiClient.post(ENDPOINTS.AUDIT_LOGS, data)
};
