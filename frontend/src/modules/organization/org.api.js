import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const orgApi = {
  // Branches
  getBranches: () => apiClient.get(ENDPOINTS.BRANCHES),
  createBranch: (data) => apiClient.post(ENDPOINTS.BRANCHES, data),
  updateBranch: (id, data) => apiClient.put(`${ENDPOINTS.BRANCHES}/${id}`, data),
  deleteBranch: (id) => apiClient.delete(`${ENDPOINTS.BRANCHES}/${id}`),

  // Warehouses
  getWarehouses: () => apiClient.get(ENDPOINTS.WAREHOUSES),
  createWarehouse: (data) => apiClient.post(ENDPOINTS.WAREHOUSES, data),
  updateWarehouse: (id, data) => apiClient.put(`${ENDPOINTS.WAREHOUSES}/${id}`, data),
  deleteWarehouse: (id) => apiClient.delete(`${ENDPOINTS.WAREHOUSES}/${id}`),

  // Shops
  getShops: () => apiClient.get(ENDPOINTS.SHOPS),
  createShop: (data) => apiClient.post(ENDPOINTS.SHOPS, data),
  updateShop: (id, data) => apiClient.put(`${ENDPOINTS.SHOPS}/${id}`, data),
  deleteShop: (id) => apiClient.delete(`${ENDPOINTS.SHOPS}/${id}`),

  // Currencies
  getCurrencies: () => apiClient.get(ENDPOINTS.CURRENCIES),
  createCurrency: (data) => apiClient.post(ENDPOINTS.CURRENCIES, data),
  updateCurrency: (id, data) => apiClient.put(`${ENDPOINTS.CURRENCIES}/${id}`, data),
  deleteCurrency: (id) => apiClient.delete(`${ENDPOINTS.CURRENCIES}/${id}`)
};
