import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const productsApi = {
  // Products
  getProducts: (params) => apiClient.get(ENDPOINTS.PRODUCTS, { params }),
  getProductById: (id) => apiClient.get(`${ENDPOINTS.PRODUCTS}/${id}`),
  createProduct: (data) => apiClient.post(ENDPOINTS.PRODUCTS, data),
  updateProduct: (id, data) => apiClient.put(`${ENDPOINTS.PRODUCTS}/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`${ENDPOINTS.PRODUCTS}/${id}`),

  // Categories
  getCategories: () => apiClient.get(ENDPOINTS.CATEGORIES),
  createCategory: (data) => apiClient.post(ENDPOINTS.CATEGORIES, data),
  updateCategory: (id, data) => apiClient.put(`${ENDPOINTS.CATEGORIES}/${id}`, data),
  deleteCategory: (id) => apiClient.delete(`${ENDPOINTS.CATEGORIES}/${id}`),

  // Quantity Units
  getUnits: () => apiClient.get(ENDPOINTS.UNITS),
  createUnit: (data) => apiClient.post(ENDPOINTS.UNITS, data),
  deleteUnit: (id) => apiClient.delete(`${ENDPOINTS.UNITS}/${id}`),

  // Packing Units
  getPackingUnits: () => apiClient.get(ENDPOINTS.PACKING_UNITS),
  createPackingUnit: (data) => apiClient.post(ENDPOINTS.PACKING_UNITS, data),
  deletePackingUnit: (id) => apiClient.delete(`${ENDPOINTS.PACKING_UNITS}/${id}`)
};
