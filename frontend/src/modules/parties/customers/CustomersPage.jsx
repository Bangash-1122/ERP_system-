import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Users, Edit2, Trash2, Phone, Mail, DollarSign } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Select, Badge } from '../../../components/ui/Input.jsx';
import { partiesApi } from '../parties.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export function CustomersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: partiesApi.getCustomers
  });

  const customers = response?.data || [];
  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: partiesApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Customer registered');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => partiesApi.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Customer updated');
      setIsModalOpen(false);
      setEditingCustomer(null);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: partiesApi.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Customer removed');
      setDeletingId(null);
    }
  });

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    reset({
      code: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      companyName: '',
      email: '',
      phone: '',
      city: '',
      address: '',
      creditLimit: 50000,
      taxNumber: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCustomer(c);
    setValue('code', c.code);
    setValue('name', c.name);
    setValue('companyName', c.companyName);
    setValue('email', c.email);
    setValue('phone', c.phone);
    setValue('city', c.city);
    setValue('address', c.address);
    setValue('creditLimit', c.creditLimit);
    setValue('taxNumber', c.taxNumber);
    setValue('status', c.status);
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    formData.creditLimit = Number(formData.creditLimit) || 0;
    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { key: 'code', header: 'Customer ID', cellClassName: 'font-mono font-bold text-sky-700' },
    {
      key: 'name',
      header: 'Customer & Company',
      cellClassName: 'font-semibold text-slate-900',
      render: (val, row) => (
        <div>
          <div>{val}</div>
          <div className="text-[11px] text-slate-400">{row.companyName || 'Individual Account'}</div>
        </div>
      )
    },
    { key: 'city', header: 'City' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'currentBalance',
      header: 'Receivable Balance',
      render: (val) => (
        <span className={`font-bold ${val > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
          {formatCurrency(val)}
        </span>
      )
    },
    {
      key: 'creditLimit',
      header: 'Credit Limit',
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
        title="Customer Directory"
        subtitle="Manage client accounts, credit terms, receivables, and contact directory"
        actions={
          <Button icon={Plus} onClick={handleOpenCreate}>
            Add Customer
          </Button>
        }
      />

      <DataTable columns={columns} data={customers} isLoading={isLoading} title="Customers" exportFileName="customers_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Edit Customer Details' : 'Register New Customer'}
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingCustomer ? 'Save Changes' : 'Create Customer'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Customer Code" required {...register('code')} />
          <Input label="Contact Person / Full Name" placeholder="e.g. Johnathan Davis" required {...register('name')} />
          <Input label="Company / Entity Name" placeholder="e.g. Acme Industrial Group" {...register('companyName')} />
          <Input label="Tax ID / VAT No" placeholder="e.g. US-TAX-998811" {...register('taxNumber')} />
          <Input label="Email" type="email" placeholder="billing@acme.com" {...register('email')} />
          <Input label="Phone Contact" placeholder="+1 (555) 000-0000" {...register('phone')} />
          <Input label="City" placeholder="e.g. New York" {...register('city')} />
          <Input label="Credit Limit ($)" type="number" defaultValue="50000" {...register('creditLimit')} />
          <div className="md:col-span-2">
            <Input label="Billing Address" placeholder="Suite #, Street Address" {...register('address')} />
          </div>
          <Select label="Status" options={['Active', 'Inactive']} {...register('status')} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Customer"
        message="Are you sure? Removing this customer will archive their transaction history."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
