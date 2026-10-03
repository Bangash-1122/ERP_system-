import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Building2, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Select, Badge } from '../../../components/ui/Input.jsx';
import { orgApi } from '../org.api.js';

export function BranchesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: orgApi.getBranches
  });

  const branches = response?.data || [];

  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: orgApi.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries(['branches']);
      toast.success('Branch registered successfully');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => orgApi.updateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['branches']);
      toast.success('Branch details updated');
      setIsModalOpen(false);
      setEditingBranch(null);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: orgApi.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries(['branches']);
      toast.success('Branch deleted');
      setDeletingId(null);
    }
  });

  const handleOpenCreate = () => {
    setEditingBranch(null);
    reset({
      code: `BR-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      city: '',
      address: '',
      phone: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch) => {
    setEditingBranch(branch);
    setValue('code', branch.code);
    setValue('name', branch.name);
    setValue('city', branch.city);
    setValue('address', branch.address);
    setValue('phone', branch.phone);
    setValue('status', branch.status);
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    if (editingBranch) {
      updateMutation.mutate({ id: editingBranch._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { key: 'code', header: 'Branch Code', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'name', header: 'Branch Name', cellClassName: 'font-semibold text-slate-900' },
    { key: 'city', header: 'City' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'isHeadOffice',
      header: 'Head Office',
      render: (val) =>
        val ? (
          <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Primary HQ
          </span>
        ) : (
          <span className="text-slate-400 text-xs">Regional</span>
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
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingId(row._id)}
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Organization Branches"
        subtitle="Manage corporate operational offices and regional business locations"
        actions={
          <Button icon={Plus} onClick={handleOpenCreate}>
            Add Branch
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={branches}
        isLoading={isLoading}
        title="Branches"
        exportFileName="branches_list"
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBranch ? 'Edit Branch' : 'Register New Branch'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingBranch ? 'Save Changes' : 'Create Branch'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Branch Code" required {...register('code')} />
          <Input label="Branch Name" placeholder="e.g. Midwest Hub" required {...register('name')} />
          <Input label="City" placeholder="e.g. Chicago" required {...register('city')} />
          <Input label="Phone Contact" placeholder="+1 (555) 000-0000" {...register('phone')} />
          <div className="md:col-span-2">
            <Input label="Physical Address" placeholder="Suite #, Street" {...register('address')} />
          </div>
          <Select
            label="Status"
            options={['Active', 'Inactive']}
            {...register('status')}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Branch"
        message="Are you sure you want to deactivate and remove this branch? Associated data may be affected."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
