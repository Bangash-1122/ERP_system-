import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, ArrowRightLeft } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal } from '../../../components/ui/Card.jsx';
import { Input, Select, Textarea, Badge } from '../../../components/ui/Input.jsx';
import { salesApi } from '../sales.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';

export function SalesReturnsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['sales-returns'],
    queryFn: salesApi.getReturns
  });

  const returns = response?.data || [];
  const { register, handleSubmit, reset } = useForm();

  const createMutation = useMutation({
    mutationFn: salesApi.createReturn,
    onSuccess: () => {
      queryClient.invalidateQueries(['sales-returns']);
      queryClient.invalidateQueries(['inventory-stock']);
      toast.success('Sales return recorded and restocked');
      setIsModalOpen(false);
      reset();
    }
  });

  const onSubmit = (formData) => {
    formData.totalRefund = Number(formData.totalRefund) || 0;
    formData.status = 'Approved';
    formData.items = [
      { productSku: 'SKU-DRL-001', productName: 'Titanium Rotary Drill 850W', quantity: 1, unitPrice: formData.totalRefund, total: formData.totalRefund }
    ];
    createMutation.mutate(formData);
  };

  const columns = [
    { key: 'returnNo', header: 'Credit Note No', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'originalSaleNo', header: 'Original Invoice', cellClassName: 'font-mono text-slate-700' },
    { key: 'date', header: 'Return Date', render: (val) => formatDate(val) },
    { key: 'customerName', header: 'Customer' },
    { key: 'reason', header: 'Reason for Return', cellClassName: 'text-slate-700' },
    {
      key: 'totalRefund',
      header: 'Credit Refund Value',
      render: (val) => <span className="font-bold text-slate-900">{formatCurrency(val)}</span>
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
        title="Sales Returns (Credit Notes)"
        subtitle="Manage customer goods returns, credit notes, restocking, and receivable adjustments"
        actions={
          <Button icon={Plus} onClick={() => { reset(); setIsModalOpen(true); }}>
            Issue Credit Note
          </Button>
        }
      />

      <DataTable columns={columns} data={returns} isLoading={isLoading} title="Sales Returns" exportFileName="sales_returns" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Sales Return / Credit Note"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
              Post Credit Note
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Original Sales Invoice No" placeholder="e.g. INV-00001" required {...register('originalSaleNo')} />
          <Input label="Customer Name" placeholder="e.g. Apex Manufacturing Corp" required {...register('customerName')} />
          <Select label="Return Destination Warehouse" options={['Main Warehouse', 'West Coast Depot']} required {...register('warehouse')} />
          <Input label="Total Credit Amount ($)" type="number" step="0.01" required {...register('totalRefund')} />
          <Textarea label="Reason for Customer Return" placeholder="Customer specification mismatch, exchange, defect..." required {...register('reason')} />
        </form>
      </Modal>
    </div>
  );
}
