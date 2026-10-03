import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Truck, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Select, Badge } from '../../../components/ui/Input.jsx';
import { partiesApi } from '../parties.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export function TransportersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransporter, setEditingTransporter] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['transporters'],
    queryFn: partiesApi.getTransporters
  });

  const transporters = response?.data || [];
  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: partiesApi.createTransporter,
    onSuccess: () => {
      queryClient.invalidateQueries(['transporters']);
      toast.success('Transporter registered');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => partiesApi.updateTransporter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['transporters']);
      toast.success('Transporter updated');
      setIsModalOpen(false);
      setEditingTransporter(null);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: partiesApi.deleteTransporter,
    onSuccess: () => {
      queryClient.invalidateQueries(['transporters']);
      toast.success('Transporter removed');
      setDeletingId(null);
    }
  });

  const handleOpenCreate = () => {
    setEditingTransporter(null);
    reset({
      code: `TRN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      city: '',
      vehicleCount: 5,
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTransporter(t);
    setValue('code', t.code);
    setValue('name', t.name);
    setValue('companyName', t.companyName);
    setValue('contactPerson', t.contactPerson);
    setValue('phone', t.phone);
    setValue('email', t.email);
    setValue('city', t.city);
    setValue('vehicleCount', t.vehicleCount);
    setValue('status', t.status);
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    formData.vehicleCount = Number(formData.vehicleCount) || 0;
    if (editingTransporter) {
      updateMutation.mutate({ id: editingTransporter._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { key: 'code', header: 'Carrier ID', cellClassName: 'font-mono font-bold text-sky-700' },
    {
      key: 'name',
      header: 'Carrier & Logistics Agency',
      cellClassName: 'font-semibold text-slate-900',
      render: (val, row) => (
        <div>
          <div>{val}</div>
          <div className="text-[11px] text-slate-400">Contact: {row.contactPerson || 'Dispatch Officer'}</div>
        </div>
      )
    },
    { key: 'phone', header: 'Dispatch Phone' },
    { key: 'city', header: 'Base City' },
    {
      key: 'vehicleCount',
      header: 'Assigned Fleet',
      render: (val) => `${val} Vehicles`
    },
    {
      key: 'currentBalance',
      header: 'Payable Freight',
      render: (val) => formatCurrency(val || 0)
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
        title="Transporters & Freight Carriers"
        subtitle="Manage third-party transport companies, haulage carriers, dispatch contacts, and fleet size"
        actions={
          <Button icon={Plus} onClick={handleOpenCreate}>
            Add Transporter
          </Button>
        }
      />

      <DataTable columns={columns} data={transporters} isLoading={isLoading} title="Transporters" exportFileName="transporters_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTransporter ? 'Edit Carrier' : 'Register Transporter / Carrier'}
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingTransporter ? 'Save Changes' : 'Create Carrier'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Carrier Code" required {...register('code')} />
          <Input label="Transport Agency Name" placeholder="e.g. FastFreight Express" required {...register('name')} />
          <Input label="Contact Person / Dispatcher" placeholder="e.g. David Miller" {...register('contactPerson')} />
          <Input label="Phone Contact" placeholder="+1 (555) 000-0000" required {...register('phone')} />
          <Input label="Email" type="email" placeholder="dispatch@carrier.com" {...register('email')} />
          <Input label="Fleet Size" type="number" defaultValue="5" {...register('vehicleCount')} />
          <Input label="Base City / Depot" placeholder="e.g. Dallas, TX" {...register('city')} />
          <Select label="Status" options={['Active', 'Inactive']} {...register('status')} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Transporter"
        message="Are you sure you want to remove this carrier record?"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
