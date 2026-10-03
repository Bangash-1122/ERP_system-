import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const accountingApi = {
  getAccounts: () => apiClient.get(ENDPOINTS.ACCOUNTS),
  createAccount: (data) => apiClient.post(ENDPOINTS.ACCOUNTS, data),
  updateAccount: (id, data) => apiClient.put(`${ENDPOINTS.ACCOUNTS}/${id}`, data),
  deleteAccount: (id) => apiClient.delete(`${ENDPOINTS.ACCOUNTS}/${id}`),

  getVouchers: (params) => apiClient.get(ENDPOINTS.VOUCHERS, { params }),
  createVoucher: (data) => apiClient.post(ENDPOINTS.VOUCHERS, data),

  getLedger: (params) => apiClient.get(ENDPOINTS.LEDGER, { params })
};
