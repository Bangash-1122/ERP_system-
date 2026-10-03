import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const dashboardApi = {
  async getDashboardData(params = {}) {
    const res = await apiClient.get(ENDPOINTS.DASHBOARD_KPIS, { params });
    return res.data;
  }
};
