import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, TrendingUp, Printer, ArrowRightLeft, FileText } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Input.jsx';
import { salesApi } from '../sales.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';

export function SalesListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('All');

  const { data: response, isLoading } = useQuery({
    queryKey: ['sales', statusFilter],
    queryFn: () => salesApi.getSales({ status: statusFilter })
  });

  const sales = response?.data || [];

  const postMutation = useMutation({
    mutationFn: salesApi.postSale,
    onSuccess: () => {
      queryClient.invalidateQueries(['sales']);
      queryClient.invalidateQueries(['inventory-stock']);
      toast.success('Sales invoice posted! Stock deducted and receivable updated.');
    }
  });

  const columns = [
    { key: 'saleNo', header: 'Invoice No', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'date', header: 'Date', render: (val) => formatDate(val) },
    { key: 'customerName', header: 'Customer', cellClassName: 'font-semibold text-slate-900' },
    { key: 'branch', header: 'Branch' },
    { key: 'warehouse', header: 'Dispatch Warehouse' },
    { key: 'subtotal', header: 'Subtotal', render: (val) => formatCurrency(val) },
    { key: 'tax', header: 'Tax', render: (val) => formatCurrency(val) },
    {
      key: 'grandTotal',
      header: 'Invoice Total',
      render: (val) => <span className="font-bold text-slate-900">{formatCurrency(val)}</span>
    },
    { key: 'receivedAmount', header: 'Received', render: (val) => formatCurrency(val) },
    {
      key: 'balanceAmount',
      header: 'Receivable Due',
      render: (val) => (
        <span className={`font-semibold ${val > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
          {formatCurrency(val)}
        </span>
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
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {row.status === 'Draft' ? (
            <Button
              size="sm"
              variant="success"
              onClick={() => postMutation.mutate(row._id)}
              isLoading={postMutation.isPending}
            >
              Post Invoice
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              icon={Printer}
              onClick={() => window.print()}
            >
              Print
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Sales Invoices & Billing"
        subtitle="Manage client sales transactions, dispatch invoices, payment tracking, and receivables"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={ArrowRightLeft} onClick={() => navigate('/sales/returns')}>
              Sales Returns
            </Button>
            <Button icon={Plus} onClick={() => navigate('/sales/create')}>
              Create Sales Invoice
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={sales}
        isLoading={isLoading}
        title="Sales Invoices"
        exportFileName="sales_invoices"
        filterComponent={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Approved">Approved</option>
            <option value="Posted">Posted</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        }
      />
    </div>
  );
}
