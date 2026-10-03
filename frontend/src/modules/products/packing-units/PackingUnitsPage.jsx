import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Boxes, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Select, Badge } from '../../../components/ui/Input.jsx';
import { productsApi } from '../products.api.js';

export function PackingUnitsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['packing-units'],
    queryFn: productsApi.getPackingUnits
  });

  const packingUnits = response?.data || [];
  const { register, handleSubmit, reset } = useForm();

  const createMutation = useMutation({
    mutationFn: productsApi.createPackingUnit,
    onSuccess: () => {
      queryClient.invalidateQueries(['packing-units']);
      toast.success('Packing unit added');
      setIsModalOpen(false);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.deletePackingUnit,
    onSuccess: () => {
      queryClient.invalidateQueries(['packing-units']);
      toast.success('Packing unit removed');
      setDeletingId(null);
    }
  });

  const onSubmit = (formData) => {
    formData.baseQuantity = Number(formData.baseQuantity) || 1;
    createMutation.mutate(formData);
  };

  const columns = [
    { key: 'code', header: 'Packing Code', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'name', header: 'Package Description', cellClassName: 'font-semibold text-slate-900' },
    {
      key: 'baseQuantity',
      header: 'Base Units / Package',
      render: (val, row) => `${val} ${row.quantityUnit || 'PCS'}`
    },
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
        title="Packing Units"
        subtitle="Manage bulk packaging configurations (Cartons, Pallets, Bundles) and unit multipliers"
        actions={
          <Button icon={Plus} onClick={() => { reset(); setIsModalOpen(true); }}>
            Add Packing Unit
          </Button>
        }
      />

      <DataTable columns={columns} data={packingUnits} isLoading={isLoading} title="Packing Units" exportFileName="packing_units_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Packing Configuration"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
              Create Packing Unit
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Packing Code" placeholder="e.g. CRATE-24" required {...register('code')} />
          <Input label="Package Name" placeholder="e.g. Wooden Crate of 24" required {...register('name')} />
          <Input label="Contains Quantity" type="number" defaultValue="24" required {...register('baseQuantity')} />
          <Select label="Base Unit" options={['PCS', 'KG', 'MTR']} required {...register('quantityUnit')} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Packing Unit"
        message="Are you sure you want to remove this packing configuration?"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
