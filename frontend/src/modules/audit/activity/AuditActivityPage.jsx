import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Eye, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Drawer } from '../../../components/ui/Card.jsx';
import { Badge } from '../../../components/ui/Input.jsx';
import { auditApi } from '../audit.api.js';
import { formatDate } from '../../../utils/formatDate.js';

export function AuditActivityPage() {
  const [moduleFilter, setModuleFilter] = useState('All');
  const [viewingLog, setViewingLog] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['audit-logs', moduleFilter],
    queryFn: () => auditApi.getLogs({ module: moduleFilter })
  });

  const logs = response?.data || [];

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (val) => formatDate(val, 'dd MMM yyyy, HH:mm:ss')
    },
    { key: 'userName', header: 'Operator', cellClassName: 'font-semibold text-slate-900' },
    { key: 'module', header: 'Module Scope' },
    {
      key: 'action',
      header: 'Operation',
      render: (val) => {
        const variants = {
          CREATE: 'success',
          UPDATE: 'primary',
          DELETE: 'danger',
          POST: 'purple',
          APPROVE: 'info'
        };
        return <Badge variant={variants[val] || 'default'} size="sm">{val}</Badge>;
      }
    },
    { key: 'entity', header: 'Entity' },
    { key: 'entityId', header: 'Entity ID', cellClassName: 'font-mono text-slate-500' },
    { key: 'details', header: 'Activity Log Particulars', cellClassName: 'text-slate-600 truncate max-w-xs' },
    { key: 'ipAddress', header: 'Origin IP', cellClassName: 'font-mono text-[11px] text-slate-400' },
    {
      key: 'actions',
      header: 'Diff',
      sortable: false,
      render: (_, row) => (
        <Button size="sm" variant="ghost" icon={Eye} onClick={() => setViewingLog(row)}>
          Inspect Diff
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Security & System Audit Trail"
        subtitle="Forensic audit logging of all system transactions, record mutations, and operator activities"
      />

      <DataTable
        columns={columns}
        data={logs}
        isLoading={isLoading}
        title="Audit Logs"
        exportFileName="audit_logs"
        filterComponent={
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Modules</option>
            <option value="Sales">Sales</option>
            <option value="Purchases">Purchases</option>
            <option value="Inventory">Inventory</option>
            <option value="Accounting">Accounting</option>
            <option value="Users">Users</option>
          </select>
        }
      />

      {/* Visual Old ➔ Diff ➔ New Inspector Drawer */}
      <Drawer
        isOpen={Boolean(viewingLog)}
        onClose={() => setViewingLog(null)}
        title="Audit Record State Inspector"
        width="max-w-2xl"
        footer={
          <Button variant="outline" onClick={() => setViewingLog(null)}>
            Close Inspector
          </Button>
        }
      >
        {viewingLog && (
          <div className="space-y-6 text-xs">
            {/* Header Meta */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">{viewingLog.entity} ({viewingLog.entityId})</span>
                <Badge size="sm">{viewingLog.action}</Badge>
              </div>
              <p className="text-slate-600">{viewingLog.details}</p>
              <div className="text-[11px] text-slate-400 pt-1">
                By {viewingLog.userName} ({viewingLog.userEmail}) from IP {viewingLog.ipAddress} on {formatDate(viewingLog.timestamp, 'dd MMM yyyy, HH:mm:ss')}
              </div>
            </div>

            {/* Changed Fields Tags */}
            {viewingLog.changedFields && viewingLog.changedFields.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Mutated Attributes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingLog.changedFields.map(field => (
                    <span key={field} className="px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded font-mono text-[11px]">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Old Data ➔ New Data Diff Visualizer */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                State Progression (Old Data ➔ New Data)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Old State */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                    Previous State (Old)
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-slate-700 overflow-x-auto bg-slate-50/50 max-h-60">
                    {viewingLog.oldData ? JSON.stringify(viewingLog.oldData, null, 2) : '// No previous record (Created initial state)'}
                  </pre>
                </div>

                {/* New State */}
                <div className="border border-sky-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-3 py-2 bg-sky-50 border-b border-sky-100 font-bold text-sky-800">
                    Current State (New)
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-sky-900 overflow-x-auto bg-sky-50/20 max-h-60">
                    {viewingLog.newData ? JSON.stringify(viewingLog.newData, null, 2) : '// Record purged or deleted'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export function TransactionHistoryPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['audit-transactions'],
    queryFn: () => auditApi.getLogs()
  });

  const transactions = response?.data || [];

  const columns = [
    { key: 'timestamp', header: 'Transaction Time', render: (val) => formatDate(val, 'dd MMM yyyy, HH:mm') },
    { key: 'entity', header: 'Document / Transaction' },
    { key: 'entityId', header: 'Ref ID', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'action', header: 'Action' },
    { key: 'userName', header: 'Authorized By' },
    { key: 'details', header: 'Audit Note' }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Transaction & Voucher Audit History"
        subtitle="Chronological transaction ledger history, post logs, and approval signoffs"
      />
      <DataTable columns={columns} data={transactions} isLoading={isLoading} title="Transactions" exportFileName="transaction_history" />
    </div>
  );
}
