import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Building, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Select, Badge } from '../../../components/ui/Input.jsx';
import { partiesApi } from '../parties.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export function SuppliersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: partiesApi.getSuppliers
  });

  const suppliers = response?.data || [];
  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: partiesApi.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers']);
      toast.success('Supplier added to directory');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => partiesApi.updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers']);
      toast.success('Supplier updated');
      setIsModalOpen(false);
      setEditingSupplier(null);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: partiesApi.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers']);
      toast.success('Supplier removed');
      setDeletingId(null);
    }
  });

  const handleOpenCreate = () => {
    setEditingSupplier(null);
    reset({
      code: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      companyName: '',
      email: '',
      phone: '',
      city: '',
      address: '',
      creditLimit: 100000,
      taxNumber: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSupplier(s);
    setValue('code', s.code);
    setValue('name', s.name);
    setValue('companyName', s.companyName);
    setValue('email', s.email);
    setValue('phone', s.phone);
    setValue('city', s.city);
    setValue('address', s.address);
    setValue('creditLimit', s.creditLimit);
    setValue('taxNumber', s.taxNumber);
    setValue('status', s.status);
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    formData.creditLimit = Number(formData.creditLimit) || 0;
    if (editingSupplier) {
      updateMutation.mutate({ id: editingSupplier._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { key: 'code', header: 'Supplier ID', cellClassName: 'font-mono font-bold text-sky-700' },
    {
      key: 'name',
      header: 'Supplier & Entity',
      cellClassName: 'font-semibold text-slate-900',
      render: (val, row) => (
        <div>
          <div>{val}</div>
          <div className="text-[11px] text-slate-400">{row.companyName || 'Manufacturer / Vendor'}</div>
        </div>
      )
    },
    { key: 'city', header: 'City' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'currentBalance',
      header: 'Payable Balance',
      render: (val) => (
        <span className={`font-bold ${val > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
          {formatCurrency(val)}
        </span>
      )
    },
    {
      key: 'creditLimit',
      header: 'Credit Line',
      render: (val) => formatCurrency(val)
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
        title="Supplier & Vendor Directory"
        subtitle="Manage procurement partners, manufacturers, raw material vendors, and payables"
        actions={
          <Button icon={Plus} onClick={handleOpenCreate}>
            Add Supplier
          </Button>
        }
      />

      <DataTable columns={columns} data={suppliers} isLoading={isLoading} title="Suppliers" exportFileName="suppliers_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSupplier ? 'Edit Supplier' : 'Add Vendor / Supplier'}
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingSupplier ? 'Save Changes' : 'Register Supplier'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Supplier Code" required {...register('code')} />
          <Input label="Supplier / Rep Name" placeholder="e.g. Apex Industrial Supplies" required {...register('name')} />
          <Input label="Company Registration" placeholder="e.g. Apex Industries LLC" {...register('companyName')} />
          <Input label="Tax ID" placeholder="e.g. US-TAX-443322" {...register('taxNumber')} />
          <Input label="Email" type="email" placeholder="sales@vendor.com" {...register('email')} />
          <Input label="Phone Contact" placeholder="+1 (555) 000-0000" {...register('phone')} />
          <Input label="City" placeholder="e.g. Pittsburgh" {...register('city')} />
          <Input label="Credit Limit ($)" type="number" defaultValue="100000" {...register('creditLimit')} />
          <div className="md:col-span-2">
            <Input label="Office Address" placeholder="Factory / Office Street Address" {...register('address')} />
          </div>
          <Select label="Status" options={['Active', 'Inactive']} {...register('status')} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier?"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
