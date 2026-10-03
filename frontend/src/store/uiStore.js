import { create } from 'zustand';

export const useUiStore = create((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  selectedBranch: 'Main Branch',
  selectedWarehouse: 'Main Warehouse',
  selectedCurrency: 'USD',
  isGlobalSearchOpen: false,
  activeFiscalYear: '2025-2026',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setSelectedWarehouse: (warehouse) => set({ selectedWarehouse: warehouse }),
  setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
  setGlobalSearchOpen: (open) => set({ isGlobalSearchOpen: open })
}));
