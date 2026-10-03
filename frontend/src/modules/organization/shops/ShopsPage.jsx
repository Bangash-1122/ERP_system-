import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Store, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Select, Badge } from '../../../components/ui/Input.jsx';
import { orgApi } from '../org.api.js';

export function ShopsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: orgApi.getShops
  });

  const shops = response?.data || [];
  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: orgApi.createShop,
    onSuccess: () => {
      queryClient.invalidateQueries(['shops']);
      toast.success('Retail shop added');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => orgApi.updateShop(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['shops']);
      toast.success('Shop updated');
      setIsModalOpen(false);
      setEditingShop(null);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: orgApi.deleteShop,
    onSuccess: () => {
      queryClient.invalidateQueries(['shops']);
      toast.success('Shop deleted');
      setDeletingId(null);
    }
  });

  const handleOpenCreate = () => {
    setEditingShop(null);
    reset({
      code: `SH-${Math.floor(10 + Math.random() * 90)}`,
      name: '',
      branch: 'Main Branch',
      warehouse: 'Main Warehouse',
      phone: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (shop) => {
    setEditingShop(shop);
    setValue('code', shop.code);
    setValue('name', shop.name);
    setValue('branch', shop.branch);
    setValue('warehouse', shop.warehouse);
    setValue('phone', shop.phone);
    setValue('status', shop.status);
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    if (editingShop) {
      updateMutation.mutate({ id: editingShop._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { key: 'code', header: 'Shop Code', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'name', header: 'Shop Outlet Name', cellClassName: 'font-semibold text-slate-900' },
    { key: 'branch', header: 'Branch' },
    { key: 'warehouse', header: 'Supply Warehouse' },
    { key: 'phone', header: 'Contact' },
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
        title="Retail Shops & Outlets"
        subtitle="Manage point-of-sale retail store branches and showroom outlets"
        actions={
          <Button icon={Plus} onClick={handleOpenCreate}>
            Add Shop
          </Button>
        }
      />

      <DataTable columns={columns} data={shops} isLoading={isLoading} title="Shops" exportFileName="shops_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShop ? 'Edit Shop' : 'Register Retail Shop'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingShop ? 'Save Changes' : 'Create Shop'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Shop Code" required {...register('code')} />
          <Input label="Shop Name" placeholder="e.g. Downtown Outlet" required {...register('name')} />
          <Select label="Parent Branch" options={['Main Branch', 'West Coast Branch']} required {...register('branch')} />
          <Select label="Linked Warehouse" options={['Main Warehouse', 'West Coast Depot']} required {...register('warehouse')} />
          <Input label="Phone Contact" placeholder="+1 (555) 000-0000" {...register('phone')} />
          <Select label="Status" options={['Active', 'Inactive']} {...register('status')} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Shop"
        message="Are you sure you want to remove this shop outlet?"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
