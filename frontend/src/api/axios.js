import axios from 'axios';
import { initialMockState } from './mockData.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexus_erp_auth_token') || 'demo-jwt-token-active';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// In-Memory Mock Fallback Database
let mockDb = { ...initialMockState };

// Automatic Mock Adapter Interceptor on Network Failures
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If backend is offline or network error, transparently resolve from enterprise mock state
    const { config } = error;
    if (!config || (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || !error.response)) {
      console.warn(`[Nexus API Client] Backend unreachable, serving from local cache: ${config?.url}`);
      return handleMockFallback(config);
    }

    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized');
    }

    return Promise.reject(error.response?.data || error);
  }
);

function handleMockFallback(config) {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};

  // Route Handlers
  if (url.includes('/reports/dashboard')) {
    return {
      success: true,
      data: {
        kpis: {
          todaySales: 4520,
          todayPurchases: 2890,
          receivables: 20650,
          payables: 14800,
          cashBalance: 14500,
          bankBalance: 58200,
          currentStockValue: 89000,
          lowStockItems: 4
        },
        charts: {
          salesTrend: [
            { month: 'Jan', sales: 45000, purchases: 32000 },
            { month: 'Feb', sales: 52000, purchases: 38000 },
            { month: 'Mar', sales: 61000, purchases: 42000 },
            { month: 'Apr', sales: 58000, purchases: 39000 },
            { month: 'May', sales: 74000, purchases: 48000 },
            { month: 'Jun', sales: 82000, purchases: 54000 },
            { month: 'Jul', sales: 79000, purchases: 51000 }
          ],
          categoryRevenue: [
            { name: 'Industrial Tools', value: 34 },
            { name: 'Raw Materials', value: 28 },
            { name: 'Electronics & Sensors', value: 22 },
            { name: 'Hardware', value: 16 }
          ],
          warehouseStock: [
            { warehouse: 'Main Warehouse', stock: 1250, value: 45000 },
            { warehouse: 'West Coast Depot', stock: 680, value: 28000 }
          ],
          receivablesVsPayables: [
            { name: 'Receivables', amount: 20650 },
            { name: 'Payables', amount: 14800 }
          ],
          cashFlow: [
            { month: 'Jan', inflow: 48000, outflow: 35000, net: 13000 },
            { month: 'Feb', inflow: 54000, outflow: 41000, net: 13000 },
            { month: 'Mar', inflow: 63000, outflow: 46000, net: 17000 },
            { month: 'Apr', inflow: 60000, outflow: 42000, net: 18000 },
            { month: 'May', inflow: 76000, outflow: 51000, net: 25000 },
            { month: 'Jun', inflow: 84000, outflow: 56000, net: 28000 }
          ]
        },
        recentTransactions: {
          sales: mockDb.sales.slice(0, 5),
          purchases: mockDb.purchases.slice(0, 5)
        }
      }
    };
  }

  // Generic Mock Collections Map
  const mapping = [
    { path: '/org/branches', key: 'branches' },
    { path: '/org/warehouses', key: 'warehouses' },
    { path: '/org/shops', key: 'shops' },
    { path: '/org/currencies', key: 'currencies' },
    { path: '/products/categories', key: 'categories' },
    { path: '/products/units', key: 'units' },
    { path: '/products/packing', key: 'packingUnits' },
    { path: '/products', key: 'products' },
    { path: '/inventory/stock', key: 'stockBalances' },
    { path: '/inventory/movements', key: 'movements' },
    { path: '/inventory/transfers', key: 'transfers' },
    { path: '/inventory/adjustments', key: 'adjustments' },
    { path: '/inventory/damages', key: 'damages' },
    { path: '/parties/customers', key: 'customers' },
    { path: '/parties/suppliers', key: 'suppliers' },
    { path: '/parties/transporters', key: 'transporters' },
    { path: '/parties/employees', key: 'employees' },
    { path: '/parties/owners', key: 'owners' },
    { path: '/parties/partnerships', key: 'partnerships' },
    { path: '/parties/saraf', key: 'saraf' },
    { path: '/purchases/returns', key: 'purchaseReturns' },
    { path: '/purchases', key: 'purchases' },
    { path: '/sales/returns', key: 'saleReturns' },
    { path: '/sales', key: 'sales' },
    { path: '/accounting/accounts', key: 'accounts' },
    { path: '/accounting/vouchers', key: 'vouchers' },
    { path: '/accounting/ledger', key: 'ledgerEntries' },
    { path: '/finance/payments', key: 'payments' },
    { path: '/finance/receipts', key: 'receipts' },
    { path: '/finance/expenses', key: 'expenses' },
    { path: '/logistics/shipments', key: 'shipments' },
    { path: '/logistics/vehicles', key: 'vehicles' },
    { path: '/logistics/deliveries', key: 'deliveries' },
    { path: '/users/roles', key: 'roles' },
    { path: '/users', key: 'users' },
    { path: '/audit', key: 'auditLogs' }
  ];

  for (const item of mapping) {
    if (url.includes(item.path)) {
      if (method === 'get') {
        return { success: true, data: mockDb[item.key] || [] };
      }
      if (method === 'post') {
        const newItem = { _id: `mock-${Date.now()}`, ...body, createdAt: new Date().toISOString() };
        mockDb[item.key] = [newItem, ...(mockDb[item.key] || [])];
        return { success: true, message: 'Created successfully', data: newItem };
      }
      if (method === 'put' || method === 'patch') {
        return { success: true, message: 'Updated successfully', data: body };
      }
      if (method === 'delete') {
        return { success: true, message: 'Deleted successfully' };
      }
    }
  }

  return { success: true, data: [] };
}

export default apiClient;
