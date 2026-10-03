import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const reportsApi = {
  getSalesReport: (params) => apiClient.get(ENDPOINTS.REPORT_SALES, { params }),
  getPurchaseReport: (params) => apiClient.get(ENDPOINTS.REPORT_PURCHASES, { params }),
  getInventoryReport: (params) => apiClient.get(ENDPOINTS.REPORT_INVENTORY, { params }),
  getProfitLoss: (params) => apiClient.get(ENDPOINTS.REPORT_PROFIT_LOSS, { params }),
  getBalanceSheet: (params) => apiClient.get(ENDPOINTS.REPORT_BALANCE_SHEET, { params })
};
