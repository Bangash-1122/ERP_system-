import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/common/KpiCard.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { Badge } from '../../components/ui/Input.jsx';
import { accountingApi } from './accounting.api.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export function BanksPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: accountingApi.getAccounts
  });

  const banks = (response?.data || []).filter(a => a.category === 'Bank' || a.name.toLowerCase().includes('bank'));

  const columns = [
    { key: 'code', header: 'GL Code', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'name', header: 'Bank & Account Title', cellClassName: 'font-semibold text-slate-900' },
    { key: 'category', header: 'Category' },
    {
      key: 'balance',
      header: 'Cleared Bank Balance',
      render: (val) => <span className="font-bold text-slate-900">{formatCurrency(val)}</span>
    },
    {
      key: 'status',
      header: 'Account Status',
      render: (val) => <Badge size="sm">{val || 'Active'}</Badge>
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Corporate Bank Accounts"
        subtitle="Manage commercial operating bank accounts, IBANs, and cleared balances"
      />
      <DataTable columns={columns} data={banks} isLoading={isLoading} title="Bank Accounts" exportFileName="bank_accounts" />
    </div>
  );
}

export function CashbooksPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: accountingApi.getAccounts
  });

  const cashAccounts = (response?.data || []).filter(a => a.category === 'Cash' || a.name.toLowerCase().includes('cash'));

  const columns = [
    { key: 'code', header: 'Cashbook Code', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'name', header: 'Drawer / Till Name', cellClassName: 'font-semibold text-slate-900' },
    {
      key: 'balance',
      header: 'Cash in Hand Balance',
      render: (val) => <span className="font-bold text-emerald-700">{formatCurrency(val)}</span>
    },
    { key: 'status', header: 'Status', render: (val) => <Badge size="sm">{val || 'Active'}</Badge> }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Cashbooks & Cash Drawers"
        subtitle="Manage branch cash drawers, store point-of-sale tills, and petty cash reserves"
      />
      <DataTable columns={columns} data={cashAccounts} isLoading={isLoading} title="Cashbooks" exportFileName="cashbooks" />
    </div>
  );
}

export function CapitalPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: accountingApi.getAccounts
  });

  const capitalAccounts = (response?.data || []).filter(a => a.type === 'Equity');

  const columns = [
    { key: 'code', header: 'Equity Code', cellClassName: 'font-mono font-bold text-purple-700' },
    { key: 'name', header: 'Capital / Equity Account', cellClassName: 'font-semibold text-slate-900' },
    {
      key: 'balance',
      header: 'Contributed Capital',
      render: (val) => <span className="font-bold text-purple-900">{formatCurrency(val)}</span>
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Equity & Capital Accounts"
        subtitle="Manage shareholder equity, retained earnings, owner capital injections, and reserves"
      />
      <DataTable columns={columns} data={capitalAccounts} isLoading={isLoading} title="Capital Accounts" exportFileName="capital_accounts" />
    </div>
  );
}

export function AssetsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: accountingApi.getAccounts
  });

  const assets = (response?.data || []).filter(a => a.type === 'Asset');

  const columns = [
    { key: 'code', header: 'Asset Code', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'name', header: 'Asset Title', cellClassName: 'font-semibold text-slate-900' },
    { key: 'category', header: 'Asset Class' },
    { key: 'balance', header: 'Valuation', render: (val) => formatCurrency(val) }
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Asset Accounts" subtitle="Current assets, fixed inventory, and receivables" />
      <DataTable columns={columns} data={assets} isLoading={isLoading} title="Assets" exportFileName="assets_list" />
    </div>
  );
}

export function LiabilitiesPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: accountingApi.getAccounts
  });

  const liabilities = (response?.data || []).filter(a => a.type === 'Liability');

  const columns = [
    { key: 'code', header: 'Liability Code', cellClassName: 'font-mono font-bold text-amber-700' },
    { key: 'name', header: 'Liability Title', cellClassName: 'font-semibold text-slate-900' },
    { key: 'category', header: 'Obligation Category' },
    { key: 'balance', header: 'Outstanding Due', render: (val) => formatCurrency(val) }
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Liabilities & Payables" subtitle="Trade accounts payable, loans, and credit lines" />
      <DataTable columns={columns} data={liabilities} isLoading={isLoading} title="Liabilities" exportFileName="liabilities_list" />
    </div>
  );
}

export function IncomePage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: accountingApi.getAccounts
  });

  const income = (response?.data || []).filter(a => a.type === 'Revenue');

  const columns = [
    { key: 'code', header: 'Revenue Code', cellClassName: 'font-mono font-bold text-emerald-700' },
    { key: 'name', header: 'Revenue Stream', cellClassName: 'font-semibold text-slate-900' },
    { key: 'balance', header: 'Accumulated Earnings', render: (val) => formatCurrency(val) }
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Income Accounts" subtitle="Operating revenue streams, commercial sales income, and gains" />
      <DataTable columns={columns} data={income} isLoading={isLoading} title="Income Streams" exportFileName="income_accounts" />
    </div>
  );
}

export function PropertyPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: accountingApi.getAccounts
  });

  const property = (response?.data || []).filter(a => a.category === 'Property' || a.name.toLowerCase().includes('property') || a.type === 'Asset');

  const columns = [
    { key: 'code', header: 'Asset ID', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'name', header: 'Fixed Property / Asset', cellClassName: 'font-semibold text-slate-900' },
    { key: 'balance', header: 'Book Value', render: (val) => formatCurrency(val) }
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Property, Plant & Equipment" subtitle="Fixed assets, warehouses, machinery, and facility capital" />
      <DataTable columns={columns} data={property} isLoading={isLoading} title="Property Accounts" exportFileName="property_accounts" />
    </div>
  );
}

export function ExpensesPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: accountingApi.getAccounts
  });

  const expenses = (response?.data || []).filter(a => a.type === 'Expense');

  const columns = [
    { key: 'code', header: 'Expense Code', cellClassName: 'font-mono font-bold text-rose-700' },
    { key: 'name', header: 'Expense Category Title', cellClassName: 'font-semibold text-slate-900' },
    { key: 'category', header: 'Cost Center' },
    { key: 'balance', header: 'YTD Cost Incurred', render: (val) => formatCurrency(val) }
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Expense Categories" subtitle="Operational overheads, COGS procurement, and SG&A expenses" />
      <DataTable columns={columns} data={expenses} isLoading={isLoading} title="Expenses" exportFileName="expense_categories" />
    </div>
  );
}
