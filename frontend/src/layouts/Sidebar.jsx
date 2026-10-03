import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Building2,
  Package,
  Boxes,
  Users2,
  Calculator,
  ShoppingCart,
  TrendingUp,
  Landmark,
  Truck,
  BarChart3,
  ShieldCheck,
  History,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { useUiStore } from '../store/uiStore.js';

export function Sidebar() {
  const { sidebarOpen } = useUiStore();
  const location = useLocation();

  // Navigation Items
  const navSections = [
    {
      title: 'Core',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Master Data & Inventory',
      items: [
        {
          label: 'Organization',
          icon: Building2,
          children: [
            { label: 'Branches', path: '/organization/branches' },
            { label: 'Warehouses', path: '/organization/warehouses' },
            { label: 'Shops', path: '/organization/shops' },
            { label: 'Currencies', path: '/organization/currencies' }
          ]
        },
        {
          label: 'Products',
          icon: Package,
          children: [
            { label: 'Product Catalog', path: '/products' },
            { label: 'Categories', path: '/products/categories' },
            { label: 'Quantity Units', path: '/products/units' },
            { label: 'Packing Units', path: '/products/packing-units' }
          ]
        },
        {
          label: 'Inventory',
          icon: Boxes,
          children: [
            { label: 'Stock Overview', path: '/inventory' },
            { label: 'Stock Movements', path: '/inventory/movements' },
            { label: 'Warehouse Transfers', path: '/inventory/transfers' },
            { label: 'Adjustments', path: '/inventory/adjustments' },
            { label: 'Damage Registry', path: '/inventory/damage' }
          ]
        },
        {
          label: 'Parties & CRM',
          icon: Users2,
          children: [
            { label: 'Customers', path: '/parties/customers' },
            { label: 'Suppliers', path: '/parties/suppliers' },
            { label: 'Transporters', path: '/parties/transporters' },
            { label: 'Employees', path: '/parties/employees' },
            { label: 'Owners', path: '/parties/owners' },
            { label: 'Partnerships', path: '/parties/partnerships' },
            { label: 'Saraf Exchange', path: '/parties/saraf' }
          ]
        }
      ]
    },
    {
      title: 'Operations',
      items: [
        {
          label: 'Purchases',
          icon: ShoppingCart,
          children: [
            { label: 'Purchase Orders', path: '/purchases' },
            { label: 'Purchase Returns', path: '/purchases/returns' }
          ]
        },
        {
          label: 'Sales & Invoicing',
          icon: TrendingUp,
          children: [
            { label: 'Sales Invoices', path: '/sales' },
            { label: 'Sales Returns', path: '/sales/returns' }
          ]
        },
        {
          label: 'Logistics',
          icon: Truck,
          children: [
            { label: 'Shipments', path: '/logistics/shipments' },
            { label: 'Vehicles Fleet', path: '/logistics/vehicles' },
            { label: 'Deliveries', path: '/logistics/deliveries' }
          ]
        }
      ]
    },
    {
      title: 'Finance & Accounts',
      items: [
        {
          label: 'Accounting',
          icon: Calculator,
          children: [
            { label: 'Chart of Accounts', path: '/accounting/chart-of-accounts' },
            { label: 'Bank Accounts', path: '/accounting/banks' },
            { label: 'Cashbooks', path: '/accounting/cashbooks' },
            { label: 'Capital Accounts', path: '/accounting/capital' },
            { label: 'Assets', path: '/accounting/assets' },
            { label: 'Liabilities', path: '/accounting/liabilities' },
            { label: 'Income Accounts', path: '/accounting/income' },
            { label: 'Property Accounts', path: '/accounting/property' },
            { label: 'Expense Categories', path: '/accounting/expenses' }
          ]
        },
        {
          label: 'Finance & Vouchers',
          icon: Landmark,
          children: [
            { label: 'Payments', path: '/finance/payments' },
            { label: 'Receipts', path: '/finance/receipts' },
            { label: 'Payment Vouchers', path: '/finance/payment-vouchers' },
            { label: 'Receipt Vouchers', path: '/finance/receipt-vouchers' },
            { label: 'Journal Vouchers', path: '/finance/journal-vouchers' },
            { label: 'General Ledger', path: '/finance/ledger' }
          ]
        },
        {
          label: 'Reports & Analytics',
          path: '/reports',
          icon: BarChart3
        }
      ]
    },
    {
      title: 'Administration',
      items: [
        {
          label: 'Users & Security',
          icon: ShieldCheck,
          children: [
            { label: 'User Directory', path: '/users' },
            { label: 'Roles & Matrix', path: '/roles' }
          ]
        },
        {
          label: 'Audit Trail',
          icon: History,
          children: [
            { label: 'Activity Logs', path: '/audit/activity' },
            { label: 'Transactions', path: '/audit/transactions' }
          ]
        }
      ]
    }
  ];

  // Open groups state
  const [openGroups, setOpenGroups] = useState({
    Organization: false,
    Products: false,
    Inventory: false,
    'Parties & CRM': false,
    Purchases: false,
    'Sales & Invoicing': false,
    Accounting: false,
    'Finance & Vouchers': false,
    Logistics: false,
    'Users & Security': false,
    'Audit Trail': false
  });

  // Auto-expand group if child is active
  useEffect(() => {
    navSections.forEach((sec) => {
      sec.items.forEach((item) => {
        if (item.children?.some((c) => location.pathname.startsWith(c.path))) {
          setOpenGroups((prev) => ({ ...prev, [item.label]: true }));
        }
      });
    });
  }, [location.pathname]);

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="h-14 px-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-md">
            N
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              NEXUS <span className="text-[10px] px-1.5 py-0.2 bg-sky-500/20 text-sky-400 font-semibold rounded">ERP</span>
            </div>
            <div className="text-[10px] text-slate-400 -mt-0.5">Enterprise Suite</div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isOpen = openGroups[item.label];

                if (!hasChildren) {
                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                          isActive
                            ? 'bg-sky-600 text-white shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        )
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                }

                return (
                  <div key={itemIdx} className="space-y-0.5">
                    <button
                      onClick={() => toggleGroup(item.label)}
                      className={clsx(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={clsx(
                          'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                          isOpen && 'rotate-180 text-sky-400'
                        )}
                      />
                    </button>

                    {isOpen && (
                      <div className="pl-6 space-y-0.5 border-l border-slate-800 ml-5 py-0.5 animate-in slide-in-from-top-1">
                        {item.children.map((child, cIdx) => (
                          <NavLink
                            key={cIdx}
                            to={child.path}
                            className={({ isActive }) =>
                              clsx(
                                'flex items-center px-3 py-1.5 rounded-md text-[12px] transition-all',
                                isActive
                                  ? 'bg-sky-500/20 text-sky-400 font-semibold'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                              )
                            }
                          >
                            <span>{child.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status Badge */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-300">Operational</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">v2.4 Enterprise</span>
        </div>
      </div>
    </aside>
  );
}
