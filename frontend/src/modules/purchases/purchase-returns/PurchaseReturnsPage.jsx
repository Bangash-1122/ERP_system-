import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, ArrowRightLeft, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal } from '../../../components/ui/Card.jsx';
import { Input, Select, Textarea, Badge } from '../../../components/ui/Input.jsx';
import { purchasesApi } from '../purchases.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';

export function PurchaseReturnsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['purchase-returns'],
    queryFn: purchasesApi.getReturns
  });

  const returns = response?.data || [];
  const { register, handleSubmit, reset } = useForm();

  const createMutation = useMutation({
    mutationFn: purchasesApi.createReturn,
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase-returns']);
      queryClient.invalidateQueries(['inventory-stock']);
      toast.success('Purchase return registered');
      setIsModalOpen(false);
      reset();
    }
  });

  const onSubmit = (formData) => {
    formData.totalRefund = Number(formData.totalRefund) || 0;
    formData.status = 'Approved';
    formData.items = [
      { productSku: 'SKU-HYD-002', productName: 'Hydraulic Pressure Valve 2.5"', quantity: 1, unitPrice: formData.totalRefund, total: formData.totalRefund }
    ];
    createMutation.mutate(formData);
  };

  const columns = [
    { key: 'returnNo', header: 'Return Ref No', cellClassName: 'font-mono font-bold text-rose-700' },
    { key: 'originalPurchaseNo', header: 'Original PO', cellClassName: 'font-mono text-sky-700' },
    { key: 'date', header: 'Return Date', render: (val) => formatDate(val) },
    { key: 'supplierName', header: 'Supplier' },
    { key: 'reason', header: 'Return Reason', cellClassName: 'text-slate-700' },
    {
      key: 'totalRefund',
      header: 'Debit Refund Value',
      render: (val) => <span className="font-bold text-rose-600">{formatCurrency(val)}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge size="sm">{val || 'Approved'}</Badge>
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Purchase Returns (Debit Notes)"
        subtitle="Manage supplier goods return notes, debit notes, and inventory return write-backs"
        actions={
          <Button icon={Plus} onClick={() => { reset(); setIsModalOpen(true); }}>
            Create Return Note
          </Button>
        }
      />

      <DataTable columns={columns} data={returns} isLoading={isLoading} title="Purchase Returns" exportFileName="purchase_returns" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Purchase Return / Debit Note"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
              Issue Return & Restock
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Original Purchase Order No" placeholder="e.g. PUR-00001" required {...register('originalPurchaseNo')} />
          <Input label="Supplier Name" placeholder="e.g. Global Heavy Industries Ltd" required {...register('supplierName')} />
          <Select label="Return From Warehouse" options={['Main Warehouse', 'West Coast Depot']} required {...register('warehouse')} />
          <Input label="Total Refund Amount ($)" type="number" step="0.01" required {...register('totalRefund')} />
          <Textarea label="Reason for Goods Return" placeholder="Defective seal, shipping damage, specification mismatch..." required {...register('reason')} />
        </form>
      </Modal>
    </div>
  );
}
