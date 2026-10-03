import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const inventoryApi = {
  // Stock
  getStock: (params) => apiClient.get(ENDPOINTS.STOCK, { params }),
  getMovements: (params) => apiClient.get(ENDPOINTS.MOVEMENTS, { params }),

  // Transfers
  getTransfers: () => apiClient.get(ENDPOINTS.TRANSFERS),
  createTransfer: (data) => apiClient.post(ENDPOINTS.TRANSFERS, data),
  updateTransferStatus: (id, status) => apiClient.patch(`${ENDPOINTS.TRANSFERS}/${id}/status`, { status }),

  // Adjustments
  getAdjustments: () => apiClient.get(ENDPOINTS.ADJUSTMENTS),
  createAdjustment: (data) => apiClient.post(ENDPOINTS.ADJUSTMENTS, data),

  // Damages
  getDamages: () => apiClient.get(ENDPOINTS.DAMAGES),
  createDamage: (data) => apiClient.post(ENDPOINTS.DAMAGES, data)
};
