import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Warehouse, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Select, Badge } from '../../../components/ui/Input.jsx';
import { orgApi } from '../org.api.js';

export function WarehousesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['warehouses'],
    queryFn: orgApi.getWarehouses
  });

  const warehouses = response?.data || [];

  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: orgApi.createWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries(['warehouses']);
      toast.success('Warehouse facility added');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => orgApi.updateWarehouse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['warehouses']);
      toast.success('Warehouse updated');
      setIsModalOpen(false);
      setEditingWarehouse(null);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: orgApi.deleteWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries(['warehouses']);
      toast.success('Warehouse deleted');
      setDeletingId(null);
    }
  });

  const handleOpenCreate = () => {
    setEditingWarehouse(null);
    reset({
      code: `WH-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      branch: 'Main Branch',
      location: '',
      capacity: 10000,
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w) => {
    setEditingWarehouse(w);
    setValue('code', w.code);
    setValue('name', w.name);
    setValue('branch', w.branch);
    setValue('location', w.location);
    setValue('capacity', w.capacity);
    setValue('status', w.status);
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    formData.capacity = Number(formData.capacity) || 0;
    if (editingWarehouse) {
      updateMutation.mutate({ id: editingWarehouse._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { key: 'code', header: 'Warehouse Code', cellClassName: 'font-mono font-bold text-amber-700' },
    { key: 'name', header: 'Warehouse Name', cellClassName: 'font-semibold text-slate-900' },
    { key: 'branch', header: 'Assigned Branch' },
    { key: 'location', header: 'Aisle / Zone Location' },
    {
      key: 'capacity',
      header: 'Capacity (Units)',
      render: (val) => Number(val).toLocaleString()
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
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => handleOpenEdit(row)} className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setDeletingId(row._id)} className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Warehouse Facilities"
        subtitle="Manage inventory distribution centers, staging zones, and regional storage"
        actions={
          <Button icon={Plus} onClick={handleOpenCreate}>
            Add Warehouse
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={warehouses}
        isLoading={isLoading}
        title="Warehouses"
        exportFileName="warehouses_list"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse Facility'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingWarehouse ? 'Save Changes' : 'Create Warehouse'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Warehouse Code" required {...register('code')} />
          <Input label="Warehouse Name" placeholder="e.g. East Depot" required {...register('name')} />
          <Select label="Branch" options={['Main Branch', 'West Coast Branch']} required {...register('branch')} />
          <Input label="Storage Capacity (Units)" type="number" {...register('capacity')} />
          <div className="md:col-span-2">
            <Input label="Physical Zone / Section" placeholder="e.g. Bay 14, Building C" {...register('location')} />
          </div>
          <Select label="Status" options={['Active', 'Inactive']} {...register('status')} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Warehouse"
        message="Are you sure? Deleting this warehouse will invalidate pending stock balance records."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
