import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const partiesApi = {
  // Customers
  getCustomers: () => apiClient.get(ENDPOINTS.CUSTOMERS),
  createCustomer: (data) => apiClient.post(ENDPOINTS.CUSTOMERS, data),
  updateCustomer: (id, data) => apiClient.put(`${ENDPOINTS.CUSTOMERS}/${id}`, data),
  deleteCustomer: (id) => apiClient.delete(`${ENDPOINTS.CUSTOMERS}/${id}`),

  // Suppliers
  getSuppliers: () => apiClient.get(ENDPOINTS.SUPPLIERS),
  createSupplier: (data) => apiClient.post(ENDPOINTS.SUPPLIERS, data),
  updateSupplier: (id, data) => apiClient.put(`${ENDPOINTS.SUPPLIERS}/${id}`, data),
  deleteSupplier: (id) => apiClient.delete(`${ENDPOINTS.SUPPLIERS}/${id}`),

  // Transporters
  getTransporters: () => apiClient.get(ENDPOINTS.TRANSPORTERS),
  createTransporter: (data) => apiClient.post(ENDPOINTS.TRANSPORTERS, data),
  updateTransporter: (id, data) => apiClient.put(`${ENDPOINTS.TRANSPORTERS}/${id}`, data),
  deleteTransporter: (id) => apiClient.delete(`${ENDPOINTS.TRANSPORTERS}/${id}`),

  // Employees
  getEmployees: () => apiClient.get(ENDPOINTS.EMPLOYEES),
  createEmployee: (data) => apiClient.post(ENDPOINTS.EMPLOYEES, data),
  updateEmployee: (id, data) => apiClient.put(`${ENDPOINTS.EMPLOYEES}/${id}`, data),
  deleteEmployee: (id) => apiClient.delete(`${ENDPOINTS.EMPLOYEES}/${id}`),

  // Owners & Partnerships & Saraf
  getOwners: () => apiClient.get(ENDPOINTS.OWNERS),
  getPartnerships: () => apiClient.get(ENDPOINTS.PARTNERSHIPS),
  getSarafs: () => apiClient.get(ENDPOINTS.SARAF),
  createSaraf: (data) => apiClient.post(ENDPOINTS.SARAF, data)
};
