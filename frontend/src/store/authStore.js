import { create } from 'zustand';

const STORAGE_KEY = 'nexus_erp_auth';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem(`${STORAGE_KEY}_user`)) || {
    id: 'usr-admin-01',
    name: 'Alexander Wright',
    email: 'admin@nexus.com',
    role: 'Administrator',
    roles: ['Administrator'],
    permissions: ['*'],
    branches: ['Main Branch', 'West Coast Branch'],
    warehouses: ['Main Warehouse', 'West Coast Depot']
  },
  token: localStorage.getItem(`${STORAGE_KEY}_token`) || 'demo-jwt-token-active',
  isAuthenticated: true,

  login: (userData, token) => {
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(userData));
    localStorage.setItem(`${STORAGE_KEY}_token`, token);
    set({ user: userData, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(`${STORAGE_KEY}_user`);
    localStorage.removeItem(`${STORAGE_KEY}_token`);
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateProfile: (updates) => {
    set((state) => {
      const updated = { ...state.user, ...updates };
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(updated));
      return { user: updated };
    });
  }
}));
