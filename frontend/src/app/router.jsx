import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout, AuthLayout } from '../layouts/DashboardLayout.jsx';

// Auth
import { LoginPage } from '../modules/auth/LoginPage.jsx';

// Dashboard
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage.jsx';

// Organization
import { BranchesPage } from '../modules/organization/branches/BranchesPage.jsx';
import { WarehousesPage } from '../modules/organization/warehouses/WarehousesPage.jsx';
import { ShopsPage } from '../modules/organization/shops/ShopsPage.jsx';
import { CurrenciesPage } from '../modules/organization/currencies/CurrenciesPage.jsx';

// Products & Catalog
import { ProductsPage } from '../modules/products/products/ProductsPage.jsx';
import { CategoriesPage } from '../modules/products/categories/CategoriesPage.jsx';
import { QuantityUnitsPage } from '../modules/products/quantity-units/QuantityUnitsPage.jsx';
import { PackingUnitsPage } from '../modules/products/packing-units/PackingUnitsPage.jsx';

// Inventory
import { StockPage } from '../modules/inventory/stock/StockPage.jsx';
import { MovementsPage } from '../modules/inventory/movements/MovementsPage.jsx';
import { TransfersPage } from '../modules/inventory/transfers/TransfersPage.jsx';
import { AdjustmentsPage } from '../modules/inventory/adjustments/AdjustmentsPage.jsx';
import { DamagePage } from '../modules/inventory/damage/DamagePage.jsx';

// Parties
import { CustomersPage } from '../modules/parties/customers/CustomersPage.jsx';
import { SuppliersPage } from '../modules/parties/suppliers/SuppliersPage.jsx';
import { TransportersPage } from '../modules/parties/transporters/TransportersPage.jsx';
import { EmployeesPage } from '../modules/parties/employees/EmployeesPage.jsx';
import { OwnersPage, PartnershipsPage, SarafPage } from '../modules/parties/owners/OwnersPage.jsx';

// Purchases
import { PurchaseListPage } from '../modules/purchases/purchase-list/PurchaseListPage.jsx';
import { PurchaseFormPage } from '../modules/purchases/purchase-form/PurchaseFormPage.jsx';
import { PurchaseReturnsPage } from '../modules/purchases/purchase-returns/PurchaseReturnsPage.jsx';

// Sales
import { SalesListPage } from '../modules/sales/sales-list/SalesListPage.jsx';
import { SalesFormPage } from '../modules/sales/sales-form/SalesFormPage.jsx';
import { SalesReturnsPage } from '../modules/sales/sales-returns/SalesReturnsPage.jsx';

// Accounting
import { ChartOfAccountsPage } from '../modules/accounting/chart-of-accounts/ChartOfAccountsPage.jsx';
import {
  BanksPage,
  CashbooksPage,
  CapitalPage,
  AssetsPage,
  LiabilitiesPage,
  IncomePage,
  PropertyPage,
  ExpensesPage
} from '../modules/accounting/AccountingViews.jsx';

// Finance
import { PaymentsPage, ReceiptsPage } from '../modules/finance/payments/PaymentsPage.jsx';
import { PaymentVouchersPage, ReceiptVouchersPage } from '../modules/finance/payment-vouchers/PaymentVouchersPage.jsx';
import { JournalVouchersPage } from '../modules/finance/journal-vouchers/JournalVouchersPage.jsx';
import { LedgerPage } from '../modules/finance/ledger/LedgerPage.jsx';

// Logistics
import { ShipmentsPage, VehiclesPage, DeliveriesPage } from '../modules/logistics/shipments/ShipmentsPage.jsx';

// Reports
import { ReportsWorkspace } from '../modules/reports/pages/ReportsWorkspace.jsx';

// Users & Security
import { UsersPage } from '../modules/users/users/UsersPage.jsx';
import { RolesPage } from '../modules/users/roles/RolesPage.jsx';

// Audit
import { AuditActivityPage, TransactionHistoryPage } from '../modules/audit/activity/AuditActivityPage.jsx';

export const router = createBrowserRouter([
  // Public Auth Route
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/', element: <Navigate to="/dashboard" replace /> }
    ]
  },

  // Protected Application Routes
  {
    element: <DashboardLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },

      // Organization
      { path: '/organization/branches', element: <BranchesPage /> },
      { path: '/organization/warehouses', element: <WarehousesPage /> },
      { path: '/organization/shops', element: <ShopsPage /> },
      { path: '/organization/currencies', element: <CurrenciesPage /> },

      // Products & Catalog
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/categories', element: <CategoriesPage /> },
      { path: '/products/units', element: <QuantityUnitsPage /> },
      { path: '/products/packing-units', element: <PackingUnitsPage /> },

      // Inventory
      { path: '/inventory', element: <StockPage /> },
      { path: '/inventory/movements', element: <MovementsPage /> },
      { path: '/inventory/transfers', element: <TransfersPage /> },
      { path: '/inventory/adjustments', element: <AdjustmentsPage /> },
      { path: '/inventory/damage', element: <DamagePage /> },

      // Parties
      { path: '/parties/customers', element: <CustomersPage /> },
      { path: '/parties/suppliers', element: <SuppliersPage /> },
      { path: '/parties/transporters', element: <TransportersPage /> },
      { path: '/parties/employees', element: <EmployeesPage /> },
      { path: '/parties/owners', element: <OwnersPage /> },
      { path: '/parties/partnerships', element: <PartnershipsPage /> },
      { path: '/parties/saraf', element: <SarafPage /> },

      // Accounting
      { path: '/accounting/chart-of-accounts', element: <ChartOfAccountsPage /> },
      { path: '/accounting/banks', element: <BanksPage /> },
      { path: '/accounting/cashbooks', element: <CashbooksPage /> },
      { path: '/accounting/capital', element: <CapitalPage /> },
      { path: '/accounting/assets', element: <AssetsPage /> },
      { path: '/accounting/liabilities', element: <LiabilitiesPage /> },
      { path: '/accounting/income', element: <IncomePage /> },
      { path: '/accounting/property', element: <PropertyPage /> },
      { path: '/accounting/expenses', element: <ExpensesPage /> },

      // Purchases
      { path: '/purchases', element: <PurchaseListPage /> },
      { path: '/purchases/create', element: <PurchaseFormPage /> },
      { path: '/purchases/returns', element: <PurchaseReturnsPage /> },

      // Sales
      { path: '/sales', element: <SalesListPage /> },
      { path: '/sales/create', element: <SalesFormPage /> },
      { path: '/sales/returns', element: <SalesReturnsPage /> },

      // Finance
      { path: '/finance/payments', element: <PaymentsPage /> },
      { path: '/finance/receipts', element: <ReceiptsPage /> },
      { path: '/finance/payment-vouchers', element: <PaymentVouchersPage /> },
      { path: '/finance/receipt-vouchers', element: <ReceiptVouchersPage /> },
      { path: '/finance/journal-vouchers', element: <JournalVouchersPage /> },
      { path: '/finance/ledger', element: <LedgerPage /> },

      // Logistics
      { path: '/logistics/shipments', element: <ShipmentsPage /> },
      { path: '/logistics/vehicles', element: <VehiclesPage /> },
      { path: '/logistics/deliveries', element: <DeliveriesPage /> },

      // Reports
      { path: '/reports', element: <ReportsWorkspace /> },
      { path: '/reports/:reportId', element: <ReportsWorkspace /> },

      // Users & Security
      { path: '/users', element: <UsersPage /> },
      { path: '/roles', element: <RolesPage /> },

      // Audit Trail
      { path: '/audit/activity', element: <AuditActivityPage /> },
      { path: '/audit/transactions', element: <TransactionHistoryPage /> },

      // Catch-all
      { path: '*', element: <Navigate to="/dashboard" replace /> }
    ]
  }
]);
