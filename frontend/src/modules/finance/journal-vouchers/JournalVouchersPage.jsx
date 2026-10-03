import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, CheckCircle2, AlertTriangle, Trash2, Eye, FileText } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, Drawer } from '../../../components/ui/Card.jsx';
import { Input, Select, Textarea, Badge } from '../../../components/ui/Input.jsx';
import { financeApi } from '../finance.api.js';
import { accountingApi } from '../../accounting/accounting.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';

export function JournalVouchersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingVoucher, setViewingVoucher] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['vouchers'],
    queryFn: () => financeApi.getVouchers({ voucherType: 'Journal' })
  });

  const vouchers = response?.data || [];

  const { data: accResponse } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: accountingApi.getAccounts
  });
  const accounts = accResponse?.data || [];

  const { register, control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      voucherType: 'Journal',
      date: new Date().toISOString().slice(0, 10),
      branch: 'Main Branch',
      description: '',
      referenceNo: '',
      entries: [
        { accountCode: '5100', accountName: 'Operational & Administrative Expense', description: 'Office lease expense', debit: 1000, credit: 0 },
        { accountCode: '1020', accountName: 'Main Corporate Operating Bank', description: 'Bank wire payment', debit: 0, credit: 1000 }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'entries' });

  const watchEntries = watch('entries');

  // Compute Debit and Credit Totals
  const totalDebit = (watchEntries || []).reduce((s, e) => s + (Number(e.debit) || 0), 0);
  const totalCredit = (watchEntries || []).reduce((s, e) => s + (Number(e.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const createMutation = useMutation({
    mutationFn: financeApi.createVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries(['vouchers']);
      queryClient.invalidateQueries(['ledger']);
      queryClient.invalidateQueries(['chart-of-accounts']);
      toast.success('Journal Voucher posted to General Ledger');
      setIsModalOpen(false);
      reset();
    }
  });

  const onSubmit = (formData) => {
    if (!isBalanced) {
      toast.error('Voucher is not balanced! Total Debit must equal Total Credit.');
      return;
    }
    formData.voucherType = 'Journal';
    formData.status = 'Posted';
    formData.totalDebit = totalDebit;
    formData.totalCredit = totalCredit;
    formData.isBalanced = isBalanced;
    formData.entries.forEach(e => {
      e.debit = Number(e.debit) || 0;
      e.credit = Number(e.credit) || 0;
    });
    createMutation.mutate(formData);
  };

  const columns = [
    { key: 'voucherNo', header: 'Voucher No', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'date', header: 'Voucher Date', render: (val) => formatDate(val) },
    { key: 'branch', header: 'Branch' },
    { key: 'description', header: 'Description / Narration', cellClassName: 'font-semibold text-slate-900' },
    {
      key: 'totalDebit',
      header: 'Total Debit',
      render: (val) => <span className="font-mono font-bold text-slate-900">{formatCurrency(val)}</span>
    },
    {
      key: 'totalCredit',
      header: 'Total Credit',
      render: (val) => <span className="font-mono font-bold text-slate-900">{formatCurrency(val)}</span>
    },
    {
      key: 'isBalanced',
      header: 'Double Entry Balance',
      render: (val) => (
        val ? (
          <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Balanced ✓
          </span>
        ) : (
          <span className="text-rose-600 font-bold text-xs flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Not Balanced ⚠
          </span>
        )
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge size="sm">{val}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, row) => (
        <Button size="sm" variant="ghost" icon={Eye} onClick={() => setViewingVoucher(row)}>
          Inspect
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Journal Vouchers (JV)"
        subtitle="Double-entry general journal vouchers with real-time debit/credit equality verification"
        actions={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Create Journal Voucher
          </Button>
        }
      />

      <DataTable columns={columns} data={vouchers} isLoading={isLoading} title="Journal Vouchers" exportFileName="journal_vouchers" />

      {/* Inspect Voucher Drawer */}
      <Drawer
        isOpen={Boolean(viewingVoucher)}
        onClose={() => setViewingVoucher(null)}
        title={`Voucher ${viewingVoucher?.voucherNo || ''}`}
        footer={
          <Button variant="outline" onClick={() => setViewingVoucher(null)}>
            Close
          </Button>
        }
      >
        {viewingVoucher && (
          <div className="space-y-5 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-sky-700">{viewingVoucher.voucherNo}</span>
                <Badge size="sm">{viewingVoucher.status}</Badge>
              </div>
              <p className="text-slate-800 font-semibold mt-1">{viewingVoucher.description}</p>
              <div className="text-[11px] text-slate-400 mt-1">Date: {formatDate(viewingVoucher.date)} · Branch: {viewingVoucher.branch}</div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-2">Accounting Double Entries</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="p-2">Account Code & Title</th>
                      <th className="p-2 text-right">Debit ($)</th>
                      <th className="p-2 text-right">Credit ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(viewingVoucher.entries || []).map((e, idx) => (
                      <tr key={idx}>
                        <td className="p-2">
                          <div className="font-semibold text-slate-800">{e.accountName}</div>
                          <div className="text-[11px] font-mono text-sky-600">{e.accountCode} - {e.description}</div>
                        </td>
                        <td className="p-2 text-right font-mono font-bold">{e.debit > 0 ? formatCurrency(e.debit) : '-'}</td>
                        <td className="p-2 text-right font-mono font-bold">{e.credit > 0 ? formatCurrency(e.credit) : '-'}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold border-t border-slate-200">
                      <td className="p-2 text-slate-900">Total Amounts</td>
                      <td className="p-2 text-right text-sky-700 font-mono">{formatCurrency(viewingVoucher.totalDebit)}</td>
                      <td className="p-2 text-right text-sky-700 font-mono">{formatCurrency(viewingVoucher.totalCredit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* New Journal Voucher Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Journal Voucher (Double-Entry)"
        maxWidth="max-w-3xl"
        footer={
          <>
            <div className="flex-1 flex items-center gap-2 text-xs">
              {isBalanced ? (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Balanced ✓
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Not Balanced ⚠ Difference: {formatCurrency(Math.abs(totalDebit - totalCredit))}
                </span>
              )}
            </div>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={!isBalanced}
              isLoading={createMutation.isPending}
            >
              Post Journal Voucher
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Voucher Date" type="date" required {...register('date')} />
            <Select label="Branch" options={['Main Branch', 'West Coast Branch']} required {...register('branch')} />
            <Input label="Reference No" placeholder="e.g. ADJ-MEMO-44" {...register('referenceNo')} />
          </div>

          <Input label="Narration / General Description" placeholder="e.g. Year end depreciation on manufacturing equipment" required {...register('description')} />

          {/* Double-Entry Matrix */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Debit & Credit Entries</label>
              <Button
                size="sm"
                variant="outline"
                icon={Plus}
                onClick={() =>
                  append({
                    accountCode: accounts[0]?.code || '1010',
                    accountName: accounts[0]?.name || 'Cash',
                    description: '',
                    debit: 0,
                    credit: 0
                  })
                }
              >
                Add Entry Line
              </Button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <div className="col-span-4">
                    <label className="text-[10px] text-slate-500 font-semibold">GL Account</label>
                    <select
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 focus:outline-none text-xs font-semibold text-slate-800"
                      {...register(`entries.${index}.accountCode`)}
                      onChange={(e) => {
                        const acc = accounts.find(a => a.code === e.target.value);
                        if (acc) {
                          setValue(`entries.${index}.accountName`, acc.name);
                        }
                      }}
                    >
                      {accounts.map(a => (
                        <option key={a.code} value={a.code}>{a.code} - {a.name} ({a.type})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] text-slate-500 font-semibold">Entry Line Memo</label>
                    <input type="text" placeholder="Line memo..." className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 focus:outline-none" {...register(`entries.${index}.description`)} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-500 font-semibold">Debit ($)</label>
                    <input type="number" step="0.01" className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-mono font-bold text-slate-900 focus:outline-none" {...register(`entries.${index}.debit`)} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-500 font-semibold">Credit ($)</label>
                    <input type="number" step="0.01" className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-mono font-bold text-slate-900 focus:outline-none" {...register(`entries.${index}.credit`)} />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {fields.length > 2 && (
                      <button type="button" onClick={() => remove(index)} className="p-1 text-rose-500 hover:bg-rose-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Total Bar */}
            <div className="mt-3 p-3 bg-slate-100 rounded-lg flex items-center justify-between font-bold text-xs">
              <span>Totals</span>
              <div className="flex gap-8 font-mono">
                <span className="text-slate-900">Total Debit: {formatCurrency(totalDebit)}</span>
                <span className="text-slate-900">Total Credit: {formatCurrency(totalCredit)}</span>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
