export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_ME: '/auth/me',

  // Organization
  BRANCHES: '/org/branches',
  WAREHOUSES: '/org/warehouses',
  SHOPS: '/org/shops',
  CURRENCIES: '/org/currencies',

  // Products
  PRODUCTS: '/products',
  CATEGORIES: '/products/categories/all',
  UNITS: '/products/units/all',
  PACKING_UNITS: '/products/packing/all',

  // Inventory
  STOCK: '/inventory/stock',
  MOVEMENTS: '/inventory/movements',
  TRANSFERS: '/inventory/transfers',
  ADJUSTMENTS: '/inventory/adjustments',
  DAMAGES: '/inventory/damages',

  // Parties
  CUSTOMERS: '/parties/customers',
  SUPPLIERS: '/parties/suppliers',
  TRANSPORTERS: '/parties/transporters',
  EMPLOYEES: '/parties/employees',
  OWNERS: '/parties/owners',
  PARTNERSHIPS: '/parties/partnerships',
  SARAF: '/parties/saraf',

  // Purchases & Sales
  PURCHASES: '/purchases',
  PURCHASE_RETURNS: '/purchases/returns/all',
  SALES: '/sales',
  SALES_RETURNS: '/sales/returns/all',

  // Accounting & Finance
  ACCOUNTS: '/accounting/accounts',
  VOUCHERS: '/accounting/vouchers',
  LEDGER: '/accounting/ledger',
  PAYMENTS: '/finance/payments',
  RECEIPTS: '/finance/receipts',
  EXPENSES: '/finance/expenses',

  // Logistics
  SHIPMENTS: '/logistics/shipments',
  VEHICLES: '/logistics/vehicles',
  DELIVERIES: '/logistics/deliveries',

  // Reports
  DASHBOARD_KPIS: '/reports/dashboard',
  REPORT_SALES: '/reports/sales',
  REPORT_PURCHASES: '/reports/purchases',
  REPORT_INVENTORY: '/reports/inventory',
  REPORT_PROFIT_LOSS: '/reports/profit-loss',
  REPORT_BALANCE_SHEET: '/reports/balance-sheet',

  // Users & Audit
  USERS: '/users',
  ROLES: '/users/roles/all',
  AUDIT_LOGS: '/audit'
};
