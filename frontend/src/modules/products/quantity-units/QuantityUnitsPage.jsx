import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Scale, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Badge } from '../../../components/ui/Input.jsx';
import { productsApi } from '../products.api.js';

export function QuantityUnitsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['quantity-units'],
    queryFn: productsApi.getUnits
  });

  const units = response?.data || [];
  const { register, handleSubmit, reset } = useForm();

  const createMutation = useMutation({
    mutationFn: productsApi.createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries(['quantity-units']);
      toast.success('Unit created');
      setIsModalOpen(false);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries(['quantity-units']);
      toast.success('Unit removed');
      setDeletingId(null);
    }
  });

  const onSubmit = (formData) => {
    createMutation.mutate(formData);
  };

  const columns = [
    { key: 'code', header: 'Unit Code', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'name', header: 'Unit Name', cellClassName: 'font-semibold text-slate-900' },
    { key: 'symbol', header: 'Display Symbol', cellClassName: 'font-bold' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge size="sm">{val || 'Active'}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, row) => (
        <button onClick={() => setDeletingId(row._id)} className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Measurement & Quantity Units"
        subtitle="Standard units of measurement for weighing, sizing, and inventory counting (PCS, KG, MTR, etc.)"
        actions={
          <Button icon={Plus} onClick={() => { reset(); setIsModalOpen(true); }}>
            Add Unit
          </Button>
        }
      />

      <DataTable columns={columns} data={units} isLoading={isLoading} title="Units" exportFileName="units_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Quantity Unit"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
              Create Unit
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Unit Code" placeholder="e.g. LTR" required {...register('code')} />
          <Input label="Unit Name" placeholder="e.g. Liters" required {...register('name')} />
          <Input label="Symbol" placeholder="e.g. L" required {...register('symbol')} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Unit"
        message="Are you sure you want to delete this measurement unit?"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
