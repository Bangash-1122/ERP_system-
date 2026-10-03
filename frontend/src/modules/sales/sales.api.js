import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const salesApi = {
  getSales: (params) => apiClient.get(ENDPOINTS.SALES, { params }),
  getSaleById: (id) => apiClient.get(`${ENDPOINTS.SALES}/${id}`),
  createSale: (data) => apiClient.post(ENDPOINTS.SALES, data),
  updateSale: (id, data) => apiClient.put(`${ENDPOINTS.SALES}/${id}`, data),
  postSale: (id) => apiClient.patch(`${ENDPOINTS.SALES}/${id}/post`),

  // Returns
  getReturns: () => apiClient.get(ENDPOINTS.SALES_RETURNS),
  createReturn: (data) => apiClient.post(ENDPOINTS.SALES_RETURNS, data)
};
