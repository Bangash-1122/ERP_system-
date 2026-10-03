import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  BarChart3,
  Printer,
  Download,
  FileSpreadsheet,
  Calendar,
  Filter,
  TrendingUp,
  ShoppingCart,
  Boxes,
  Users,
  DollarSign,
  Scale,
  RotateCcw
} from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { reportsApi } from '../reports.api.js';
import { initialMockState } from '../../../api/mockData.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';
import { exportToPDF, exportToExcel, exportToCSV } from '../../../utils/export.js';
import { toast } from 'sonner';

export function ReportsWorkspace() {
  const [activeReport, setActiveReport] = useState('sales');
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10));
  const [selectedBranch, setSelectedBranch] = useState('All');

  const reportMenu = [
    { id: 'sales', label: 'Sales Invoices Report', icon: TrendingUp, category: 'Commercial' },
    { id: 'purchases', label: 'Purchase Procurement Report', icon: ShoppingCart, category: 'Commercial' },
    { id: 'inventory', label: 'Stock Valuation & Balances', icon: Boxes, category: 'Inventory' },
    { id: 'customer-ledger', label: 'Customer Receivables Ledger', icon: Users, category: 'Financial' },
    { id: 'supplier-ledger', label: 'Supplier Payables Ledger', icon: Users, category: 'Financial' },
    { id: 'profit-loss', label: 'Profit & Loss Statement (P&L)', icon: DollarSign, category: 'Financial' },
    { id: 'balance-sheet', label: 'Balance Sheet & Equity', icon: Scale, category: 'Financial' },
    { id: 'trial-balance', label: 'Trial Balance Matrix', icon: FileText, category: 'Financial' },
    { id: 'audit', label: 'System Audit Trail Report', icon: FileText, category: 'Compliance' }
  ];

  // Dynamic Report Data Fetcher
  const { data: salesData } = useQuery({ queryKey: ['rep-sales'], queryFn: reportsApi.getSalesReport });
  const { data: purchaseData } = useQuery({ queryKey: ['rep-purchases'], queryFn: reportsApi.getPurchaseReport });
  const { data: invData } = useQuery({ queryKey: ['rep-inv'], queryFn: reportsApi.getInventoryReport });

  // Get current active table data & columns based on selection
  let currentColumns = [];
  let currentData = [];
  let reportTitle = 'Report';

  if (activeReport === 'sales') {
    reportTitle = 'Sales Orders & Invoicing Report';
    currentData = salesData?.data || initialMockState.sales;
    currentColumns = [
      { key: 'saleNo', header: 'Invoice No', cellClassName: 'font-mono font-bold text-sky-700' },
      { key: 'date', header: 'Date', render: (val) => formatDate(val) },
      { key: 'customerName', header: 'Customer Entity', cellClassName: 'font-semibold' },
      { key: 'grandTotal', header: 'Gross Value', render: (val) => formatCurrency(val) },
      { key: 'receivedAmount', header: 'Settled', render: (val) => formatCurrency(val) },
      { key: 'balanceAmount', header: 'Due Balance', render: (val) => <span className="font-bold text-rose-600">{formatCurrency(val)}</span> },
      { key: 'status', header: 'Status' }
    ];
  } else if (activeReport === 'purchases') {
    reportTitle = 'Procurement & Purchase Orders Report';
    currentData = purchaseData?.data || initialMockState.purchases;
    currentColumns = [
      { key: 'purchaseNo', header: 'PO Ref', cellClassName: 'font-mono font-bold text-sky-700' },
      { key: 'date', header: 'Date', render: (val) => formatDate(val) },
      { key: 'supplierName', header: 'Vendor Entity', cellClassName: 'font-semibold' },
      { key: 'grandTotal', header: 'PO Total', render: (val) => formatCurrency(val) },
      { key: 'paidAmount', header: 'Paid Out', render: (val) => formatCurrency(val) },
      { key: 'balanceAmount', header: 'Payable Due', render: (val) => <span className="font-bold text-amber-700">{formatCurrency(val)}</span> },
      { key: 'status', header: 'Status' }
    ];
  } else if (activeReport === 'inventory') {
    reportTitle = 'Inventory Valuation & Location Balances';
    currentData = invData?.data || initialMockState.stockBalances;
    currentColumns = [
      { key: 'productSku', header: 'SKU Code', cellClassName: 'font-mono font-bold text-sky-700' },
      { key: 'productName', header: 'Product Description', cellClassName: 'font-semibold' },
      { key: 'warehouseName', header: 'Storage Depot' },
      { key: 'onHand', header: 'Physical On-Hand', render: (val) => `${val} units` },
      { key: 'available', header: 'Free Available', render: (val) => `${val} units` },
      { key: 'reserved', header: 'Reserved' },
      { key: 'damaged', header: 'Quarantine / Damaged' }
    ];
  } else if (activeReport === 'customer-ledger') {
    reportTitle = 'Customer Accounts Receivable Ledger';
    currentData = initialMockState.customers;
    currentColumns = [
      { key: 'code', header: 'Customer ID', cellClassName: 'font-mono font-bold text-sky-700' },
      { key: 'name', header: 'Client Account Name', cellClassName: 'font-semibold' },
      { key: 'city', header: 'Jurisdiction' },
      { key: 'creditLimit', header: 'Approved Credit Line', render: (val) => formatCurrency(val) },
      { key: 'currentBalance', header: 'Outstanding Receivable', render: (val) => <span className="font-bold text-rose-600">{formatCurrency(val)}</span> }
    ];
  } else if (activeReport === 'supplier-ledger') {
    reportTitle = 'Supplier Accounts Payable Ledger';
    currentData = initialMockState.suppliers;
    currentColumns = [
      { key: 'code', header: 'Vendor ID', cellClassName: 'font-mono font-bold text-sky-700' },
      { key: 'name', header: 'Supplier Account Name', cellClassName: 'font-semibold' },
      { key: 'city', header: 'Location' },
      { key: 'currentBalance', header: 'Payable Balance Outstanding', render: (val) => <span className="font-bold text-amber-700">{formatCurrency(val)}</span> }
    ];
  } else if (activeReport === 'profit-loss') {
    reportTitle = 'Income Statement (Profit & Loss)';
    currentData = [
      { item: 'Operating Sales Revenue', amount: 145000, category: 'Revenue' },
      { item: 'Cost of Goods Sold (COGS)', amount: -82000, category: 'COGS' },
      { item: 'Gross Profit Margin', amount: 63000, category: 'Gross Margin' },
      { item: 'Operational & Admin Expenses', amount: -15550, category: 'Operating Expense' },
      { item: 'Net Operating Profit (EBIT)', amount: 47450, category: 'Net Income' }
    ];
    currentColumns = [
      { key: 'item', header: 'Financial Line Item', cellClassName: 'font-semibold text-slate-900' },
      { key: 'category', header: 'Accounting Classification' },
      {
        key: 'amount',
        header: 'Amount ($)',
        render: (val) => (
          <span className={`font-mono font-bold ${val < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {val < 0 ? `(${formatCurrency(Math.abs(val))})` : formatCurrency(val)}
          </span>
        )
      }
    ];
  } else if (activeReport === 'balance-sheet') {
    reportTitle = 'Consolidated Balance Sheet';
    currentData = [
      { assetClass: 'Current Assets (Cash, Bank, Inventory, Receivables)', total: 182350, type: 'Total Assets' },
      { assetClass: 'Current Liabilities (Accounts Payable & Accruals)', total: 14800, type: 'Total Liabilities' },
      { assetClass: 'Shareholder Capital & Retained Earnings', total: 167550, type: 'Total Equity' }
    ];
    currentColumns = [
      { key: 'assetClass', header: 'Balance Sheet Class', cellClassName: 'font-semibold text-slate-900' },
      { key: 'type', header: 'Financial Group' },
      { key: 'total', header: 'Book Value ($)', render: (val) => <span className="font-mono font-bold text-slate-900">{formatCurrency(val)}</span> }
    ];
  } else {
    reportTitle = 'Audit & System Logs Report';
    currentData = initialMockState.auditLogs;
    currentColumns = [
      { key: 'timestamp', header: 'Timestamp', render: (val) => formatDate(val, 'dd MMM yyyy, HH:mm') },
      { key: 'userName', header: 'User' },
      { key: 'module', header: 'Module' },
      { key: 'action', header: 'Action' },
      { key: 'details', header: 'Activity Summary' }
    ];
  }

  const handleGenerate = () => {
    toast.success(`Generated ${reportTitle} for range: ${dateFrom} to ${dateTo}`);
  };

  const handleReset = () => {
    setDateFrom('2025-01-01');
    setDateTo(new Date().toISOString().slice(0, 10));
    setSelectedBranch('All');
    toast.info('Filters reset to default');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Reporting Workspace"
        subtitle="Consolidated financial statements, sales analytics, inventory valuations, and audit extracts"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={Printer} onClick={() => window.print()}>
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => exportToPDF(currentColumns, currentData, reportTitle, activeReport)}
            >
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={FileSpreadsheet}
              onClick={() => exportToExcel(currentData, activeReport)}
            >
              Export Excel
            </Button>
          </div>
        }
      />

      {/* Workspace Split Layout: Navigation on Left, Report on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sidebar: Report Navigator */}
        <Card title="Report Catalog" subtitle="Select analysis sheet" className="lg:col-span-1">
          <div className="space-y-1 text-xs">
            {reportMenu.map((rep) => {
              const Icon = rep.icon;
              const isActive = activeReport === rep.id;
              return (
                <button
                  key={rep.id}
                  onClick={() => setActiveReport(rep.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{rep.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Center / Right: Filters & Report Table */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Filter Bar */}
          <Card title="Report Query Parameters" subtitle="Filter datasets by reporting date window, branches, and locations">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-500 font-semibold mb-1 block">Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold mb-1 block">Date To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold mb-1 block">Branch Scope</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
                >
                  <option value="All">Consolidated (All Branches)</option>
                  <option value="Main Branch">Main Branch</option>
                  <option value="West Coast Branch">West Coast Branch</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <Button size="sm" variant="primary" className="flex-1" onClick={handleGenerate}>
                  Generate
                </Button>
                <Button size="sm" variant="outline" icon={RotateCcw} onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          {/* Report Data Table */}
          <DataTable
            columns={currentColumns}
            data={currentData}
            title={reportTitle}
            exportFileName={`report_${activeReport}`}
          />
        </div>
      </div>
    </div>
  );
}
