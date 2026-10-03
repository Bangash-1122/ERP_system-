import apiClient from '../../api/axios.js';
import { ENDPOINTS } from '../../api/endpoints.js';

export const usersApi = {
  getUsers: () => apiClient.get(ENDPOINTS.USERS),
  createUser: (data) => apiClient.post(ENDPOINTS.USERS, data),
  updateUser: (id, data) => apiClient.put(`${ENDPOINTS.USERS}/${id}`, data),
  deleteUser: (id) => apiClient.delete(`${ENDPOINTS.USERS}/${id}`),

  getRoles: () => apiClient.get(ENDPOINTS.ROLES),
  createRole: (data) => apiClient.post(ENDPOINTS.ROLES, data),
  updateRole: (id, data) => apiClient.put(`${ENDPOINTS.ROLES}/${id}`, data),
  deleteRole: (id) => apiClient.delete(`${ENDPOINTS.ROLES}/${id}`)
};
