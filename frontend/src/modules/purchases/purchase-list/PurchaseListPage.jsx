import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, ShoppingCart, Eye, CheckCircle2, FileText, ArrowRightLeft } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Input.jsx';
import { purchasesApi } from '../purchases.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';

export function PurchaseListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('All');

  const { data: response, isLoading } = useQuery({
    queryKey: ['purchases', statusFilter],
    queryFn: () => purchasesApi.getPurchases({ status: statusFilter })
  });

  const purchases = response?.data || [];

  const postMutation = useMutation({
    mutationFn: purchasesApi.postPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries(['purchases']);
      queryClient.invalidateQueries(['inventory-stock']);
      toast.success('Purchase order posted! Stock and payables updated.');
    }
  });

  const columns = [
    { key: 'purchaseNo', header: 'PO Number', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'date', header: 'Date', render: (val) => formatDate(val) },
    { key: 'supplierName', header: 'Supplier / Vendor', cellClassName: 'font-semibold text-slate-900' },
    { key: 'branch', header: 'Branch' },
    { key: 'warehouse', header: 'Warehouse Target' },
    { key: 'subtotal', header: 'Subtotal', render: (val) => formatCurrency(val) },
    { key: 'tax', header: 'Tax', render: (val) => formatCurrency(val) },
    {
      key: 'grandTotal',
      header: 'Grand Total',
      render: (val) => <span className="font-bold text-slate-900">{formatCurrency(val)}</span>
    },
    { key: 'paidAmount', header: 'Paid', render: (val) => formatCurrency(val) },
    {
      key: 'balanceAmount',
      header: 'Balance',
      render: (val) => (
        <span className={`font-semibold ${val > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
          {formatCurrency(val)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge size="sm">{val}</Badge>
    },
    { key: 'createdBy', header: 'Created By', cellClassName: 'text-slate-400 text-xs' },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {row.status === 'Draft' && (
            <Button
              size="sm"
              variant="success"
              onClick={() => postMutation.mutate(row._id)}
              isLoading={postMutation.isPending}
            >
              Post Order
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Purchase Orders"
        subtitle="Manage supplier procurement, incoming shipments, invoice receipting, and accounts payable"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={ArrowRightLeft} onClick={() => navigate('/purchases/returns')}>
              Purchase Returns
            </Button>
            <Button icon={Plus} onClick={() => navigate('/purchases/create')}>
              Create Purchase Order
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={purchases}
        isLoading={isLoading}
        title="Purchases"
        exportFileName="purchase_orders_list"
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
