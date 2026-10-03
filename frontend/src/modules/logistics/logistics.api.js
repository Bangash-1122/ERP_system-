import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const logisticsApi = {
  getShipments: (params) => apiClient.get(ENDPOINTS.SHIPMENTS, { params }),
  createShipment: (data) => apiClient.post(ENDPOINTS.SHIPMENTS, data),
  updateShipment: (id, data) => apiClient.put(`${ENDPOINTS.SHIPMENTS}/${id}`, data),

  getVehicles: () => apiClient.get(ENDPOINTS.VEHICLES),
  createVehicle: (data) => apiClient.post(ENDPOINTS.VEHICLES, data),
  updateVehicle: (id, data) => apiClient.put(`${ENDPOINTS.VEHICLES}/${id}`, data),

  getDeliveries: () => apiClient.get(ENDPOINTS.DELIVERIES),
  createDelivery: (data) => apiClient.post(ENDPOINTS.DELIVERIES, data),
  updateDelivery: (id, data) => apiClient.put(`${ENDPOINTS.DELIVERIES}/${id}`, data)
};
