import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Printer, Download, Filter, FileSpreadsheet } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { financeApi } from '../finance.api.js';
import { accountingApi } from '../../accounting/accounting.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';
import { exportToPDF, exportToExcel, exportToCSV } from '../../../utils/export.js';

export function LedgerPage() {
  const [selectedAccountCode, setSelectedAccountCode] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');

  const { data: accResponse } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: accountingApi.getAccounts
  });
  const accounts = accResponse?.data || [];

  const { data: response, isLoading } = useQuery({
    queryKey: ['ledger', selectedAccountCode, selectedBranch],
    queryFn: () => financeApi.getLedger({ accountCode: selectedAccountCode, branch: selectedBranch })
  });

  const ledgerEntries = response?.data || [];

  const totalDebit = ledgerEntries.reduce((s, e) => s + (Number(e.debit) || 0), 0);
  const totalCredit = ledgerEntries.reduce((s, e) => s + (Number(e.credit) || 0), 0);

  const columns = [
    { key: 'date', header: 'Posting Date', render: (val) => formatDate(val) },
    { key: 'voucherNo', header: 'Voucher No', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'voucherType', header: 'Type', cellClassName: 'font-medium text-slate-500' },
    { key: 'accountName', header: 'GL Account', cellClassName: 'font-semibold text-slate-900' },
    { key: 'description', header: 'Narration & Particulars', cellClassName: 'text-slate-700' },
    {
      key: 'debit',
      header: 'Debit ($)',
      render: (val) => (val > 0 ? <span className="font-mono font-bold text-slate-900">{formatCurrency(val)}</span> : '-')
    },
    {
      key: 'credit',
      header: 'Credit ($)',
      render: (val) => (val > 0 ? <span className="font-mono font-bold text-slate-900">{formatCurrency(val)}</span> : '-')
    },
    {
      key: 'runningBalance',
      header: 'Cumulative Balance',
      render: (val) => (
        <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
          {formatCurrency(val)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="General Ledger"
        subtitle="Individual account ledger books with continuous running balances, debit/credit entries, and export options"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={() => window.print()}
            >
              Print Ledger
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => exportToPDF(columns, ledgerEntries, 'General Ledger', 'general_ledger')}
            >
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={FileSpreadsheet}
              onClick={() => exportToExcel(ledgerEntries, 'general_ledger')}
            >
              Excel
            </Button>
          </div>
        }
      />

      {/* Account Filters Card */}
      <Card title="Ledger Book Selector" subtitle="Filter by specific GL chart of accounts and branches">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Account Head</label>
            <select
              value={selectedAccountCode}
              onChange={(e) => setSelectedAccountCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
            >
              <option value="All">All General Ledger Accounts</option>
              {accounts.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code} - {a.name} ({a.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Operating Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
            >
              <option value="All">All Branches Consolidated</option>
              <option value="Main Branch">Main Branch</option>
              <option value="West Coast Branch">West Coast Branch</option>
            </select>
          </div>

          <div className="flex items-end gap-3 font-mono text-xs pb-1">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex-1">
              <div className="text-[10px] text-slate-400 uppercase font-sans">Total Debits</div>
              <div className="font-bold text-slate-900">{formatCurrency(totalDebit)}</div>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex-1">
              <div className="text-[10px] text-slate-400 uppercase font-sans">Total Credits</div>
              <div className="font-bold text-slate-900">{formatCurrency(totalCredit)}</div>
            </div>
          </div>
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={ledgerEntries}
        isLoading={isLoading}
        title="General Ledger"
        exportFileName="general_ledger_entries"
      />
    </div>
  );
}
