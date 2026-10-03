import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Globe, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Select, Badge } from '../../../components/ui/Input.jsx';
import { orgApi } from '../org.api.js';

export function CurrenciesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: orgApi.getCurrencies
  });

  const currencies = response?.data || [];
  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: orgApi.createCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries(['currencies']);
      toast.success('Currency registered');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => orgApi.updateCurrency(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['currencies']);
      toast.success('Currency updated');
      setIsModalOpen(false);
      setEditingCurrency(null);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: orgApi.deleteCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries(['currencies']);
      toast.success('Currency deleted');
      setDeletingId(null);
    }
  });

  const handleOpenCreate = () => {
    setEditingCurrency(null);
    reset({
      code: '',
      name: '',
      symbol: '$',
      exchangeRate: 1.0,
      isBase: false,
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCurrency(c);
    setValue('code', c.code);
    setValue('name', c.name);
    setValue('symbol', c.symbol);
    setValue('exchangeRate', c.exchangeRate);
    setValue('isBase', c.isBase);
    setValue('status', c.status);
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    formData.exchangeRate = Number(formData.exchangeRate) || 1.0;
    formData.isBase = Boolean(formData.isBase);
    if (editingCurrency) {
      updateMutation.mutate({ id: editingCurrency._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { key: 'code', header: 'ISO Code', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'name', header: 'Currency Name', cellClassName: 'font-semibold text-slate-900' },
    { key: 'symbol', header: 'Symbol', cellClassName: 'font-bold text-slate-700' },
    {
      key: 'exchangeRate',
      header: 'Exchange Rate',
      render: (val, row) => (row.isBase ? '1.0000 (Base)' : Number(val).toFixed(4))
    },
    {
      key: 'isBase',
      header: 'Base Currency',
      render: (val) =>
        val ? (
          <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Base Reporting
          </span>
        ) : (
          <span className="text-slate-400 text-xs">Foreign</span>
        )
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
          {!row.isBase && (
            <button onClick={() => setDeletingId(row._id)} className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Multi-Currency Management"
        subtitle="Manage global exchange rates, base reporting currencies, and transaction symbols"
        actions={
          <Button icon={Plus} onClick={handleOpenCreate}>
            Add Currency
          </Button>
        }
      />

      <DataTable columns={columns} data={currencies} isLoading={isLoading} title="Currencies" exportFileName="currencies_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCurrency ? 'Edit Currency' : 'Add Currency'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingCurrency ? 'Save Changes' : 'Create Currency'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Currency Code (ISO)" placeholder="e.g. CAD" required {...register('code')} />
          <Input label="Currency Name" placeholder="e.g. Canadian Dollar" required {...register('name')} />
          <Input label="Symbol" placeholder="e.g. $" required {...register('symbol')} />
          <Input label="Exchange Rate (vs Base)" type="number" step="0.0001" required {...register('exchangeRate')} />
          <Select label="Status" options={['Active', 'Inactive']} {...register('status')} />
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" id="isBaseCheck" className="rounded text-sky-600 focus:ring-sky-500" {...register('isBase')} />
            <label htmlFor="isBaseCheck" className="text-xs font-semibold text-slate-700">Set as Company Base Currency</label>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Currency"
        message="Are you sure? Removing this currency may impact linked transaction conversion histories."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
