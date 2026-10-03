import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, FolderTree, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Textarea, Badge } from '../../../components/ui/Input.jsx';
import { productsApi } from '../products.api.js';

export function CategoriesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories
  });

  const categories = response?.data || [];
  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: productsApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category created');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productsApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category updated');
      setIsModalOpen(false);
      setEditingCategory(null);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted');
      setDeletingId(null);
    }
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    reset({
      code: `CAT-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      description: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCategory(c);
    setValue('code', c.code);
    setValue('name', c.name);
    setValue('description', c.description);
    setValue('status', c.status);
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { key: 'code', header: 'Category Code', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'name', header: 'Category Name', cellClassName: 'font-semibold text-slate-900' },
    { key: 'description', header: 'Description', cellClassName: 'text-slate-500' },
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
        title="Product Categories"
        subtitle="Organize product inventory into parent-child structural hierarchies"
        actions={
          <Button icon={Plus} onClick={handleOpenCreate}>
            Add Category
          </Button>
        }
      />

      <DataTable columns={columns} data={categories} isLoading={isLoading} title="Categories" exportFileName="categories_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Category Code" required {...register('code')} />
          <Input label="Category Name" placeholder="e.g. Electrical Components" required {...register('name')} />
          <Textarea label="Description" placeholder="Optional notes on this classification..." {...register('description')} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Category"
        message="Are you sure? Removing this category may affect items mapped to it."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
