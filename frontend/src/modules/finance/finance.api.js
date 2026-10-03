import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const financeApi = {
  getPayments: (params) => apiClient.get(ENDPOINTS.PAYMENTS, { params }),
  createPayment: (data) => apiClient.post(ENDPOINTS.PAYMENTS, data),

  getReceipts: (params) => apiClient.get(ENDPOINTS.RECEIPTS, { params }),
  createReceipt: (data) => apiClient.post(ENDPOINTS.RECEIPTS, data),

  getExpenses: (params) => apiClient.get(ENDPOINTS.EXPENSES, { params }),
  createExpense: (data) => apiClient.post(ENDPOINTS.EXPENSES, data),

  getVouchers: (params) => apiClient.get(ENDPOINTS.VOUCHERS, { params }),
  createVoucher: (data) => apiClient.post(ENDPOINTS.VOUCHERS, data),

  getLedger: (params) => apiClient.get(ENDPOINTS.LEDGER, { params })
};
