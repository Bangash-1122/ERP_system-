import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Badge } from '../../../components/ui/Input.jsx';
import { financeApi } from '../finance.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';

export function PaymentVouchersPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['vouchers-payment'],
    queryFn: () => financeApi.getVouchers({ voucherType: 'Payment' })
  });

  const vouchers = response?.data || [];

  const columns = [
    { key: 'voucherNo', header: 'Voucher No', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'date', header: 'Date', render: (val) => formatDate(val) },
    { key: 'description', header: 'Narration & Particulars', cellClassName: 'font-semibold text-slate-900' },
    { key: 'branch', header: 'Branch' },
    {
      key: 'totalDebit',
      header: 'Voucher Amount',
      render: (val) => <span className="font-bold text-rose-600">{formatCurrency(val)}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge size="sm">{val}</Badge>
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Payment Vouchers (PV)"
        subtitle="Audited records of all outgoing disbursement vouchers and accounting GL postings"
      />
      <DataTable columns={columns} data={vouchers} isLoading={isLoading} title="Payment Vouchers" exportFileName="payment_vouchers" />
    </div>
  );
}

export function ReceiptVouchersPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['vouchers-receipt'],
    queryFn: () => financeApi.getVouchers({ voucherType: 'Receipt' })
  });

  const vouchers = response?.data || [];

  const columns = [
    { key: 'voucherNo', header: 'Voucher No', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'date', header: 'Date', render: (val) => formatDate(val) },
    { key: 'description', header: 'Narration & Particulars', cellClassName: 'font-semibold text-slate-900' },
    { key: 'branch', header: 'Branch' },
    {
      key: 'totalDebit',
      header: 'Received Amount',
      render: (val) => <span className="font-bold text-emerald-700">{formatCurrency(val)}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge size="sm">{val}</Badge>
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Receipt Vouchers (RV)"
        subtitle="Audited records of all customer collections and money receipts posted to ledger"
      />
      <DataTable columns={columns} data={vouchers} isLoading={isLoading} title="Receipt Vouchers" exportFileName="receipt_vouchers" />
    </div>
  );
}
