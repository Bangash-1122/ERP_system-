import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const purchasesApi = {
  getPurchases: (params) => apiClient.get(ENDPOINTS.PURCHASES, { params }),
  getPurchaseById: (id) => apiClient.get(`${ENDPOINTS.PURCHASES}/${id}`),
  createPurchase: (data) => apiClient.post(ENDPOINTS.PURCHASES, data),
  updatePurchase: (id, data) => apiClient.put(`${ENDPOINTS.PURCHASES}/${id}`, data),
  postPurchase: (id) => apiClient.patch(`${ENDPOINTS.PURCHASES}/${id}/post`),

  // Returns
  getReturns: () => apiClient.get(ENDPOINTS.PURCHASE_RETURNS),
  createReturn: (data) => apiClient.post(ENDPOINTS.PURCHASE_RETURNS, data)
};
