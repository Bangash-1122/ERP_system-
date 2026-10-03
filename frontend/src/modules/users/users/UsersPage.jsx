import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, User, ShieldCheck, Edit2, Trash2, Key } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Select, Badge } from '../../../components/ui/Input.jsx';
import { usersApi } from '../users.api.js';
import { formatDate } from '../../../utils/formatDate.js';

export function UsersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers
  });

  const users = response?.data || [];

  const { data: roleResponse } = useQuery({ queryKey: ['roles'], queryFn: usersApi.getRoles });
  const roles = roleResponse?.data || [];

  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User account created');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => usersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User updated');
      setIsModalOpen(false);
      setEditingUser(null);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted');
      setDeletingId(null);
    }
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    reset({
      name: '',
      email: '',
      phone: '',
      employeeId: 'EMP-001',
      role: 'Manager',
      branches: 'Main Branch',
      warehouses: 'Main Warehouse',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setValue('name', u.name);
    setValue('email', u.email);
    setValue('phone', u.phone);
    setValue('employeeId', u.employeeId);
    setValue('role', u.role);
    setValue('branches', Array.isArray(u.branches) ? u.branches.join(', ') : u.branches);
    setValue('warehouses', Array.isArray(u.warehouses) ? u.warehouses.join(', ') : u.warehouses);
    setValue('active', u.active);
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    formData.branches = formData.branches ? formData.branches.split(',').map(b => b.trim()) : ['Main Branch'];
    formData.warehouses = formData.warehouses ? formData.warehouses.split(',').map(w => w.trim()) : ['Main Warehouse'];
    if (editingUser) {
      updateMutation.mutate({ id: editingUser._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Full Name & Email',
      cellClassName: 'font-semibold text-slate-900',
      render: (val, row) => (
        <div>
          <div>{val}</div>
          <div className="text-[11px] text-slate-400">{row.email}</div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Security Role',
      render: (val) => (
        <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-xs">
          {val}
        </span>
      )
    },
    { key: 'phone', header: 'Phone' },
    { key: 'employeeId', header: 'Employee Badge', cellClassName: 'font-mono text-slate-500' },
    {
      key: 'branches',
      header: 'Assigned Branches',
      render: (val) => (Array.isArray(val) ? val.join(', ') : val || 'Main Branch')
    },
    {
      key: 'active',
      header: 'Status',
      render: (val) => <Badge size="sm">{val ? 'Active' : 'Inactive'}</Badge>
    },
    {
      key: 'lastLogin',
      header: 'Last Authentication',
      render: (val) => (val ? formatDate(val, 'dd MMM yyyy, HH:mm') : 'Never')
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
        title="User Accounts & Access Control"
        subtitle="Manage operators, branch permissions, warehouse assignments, and authentication status"
        actions={
          <Button icon={Plus} onClick={handleOpenCreate}>
            Add User
          </Button>
        }
      />

      <DataTable columns={columns} data={users} isLoading={isLoading} title="Users" exportFileName="users_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User Profile' : 'Register New User Account'}
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingUser ? 'Save User' : 'Create User'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="e.g. Marcus Vance" required {...register('name')} />
          <Input label="Corporate Email" type="email" placeholder="marcus@company.com" required {...register('email')} />
          <Input label="Phone Contact" placeholder="+1 (555) 000-0000" {...register('phone')} />
          <Input label="Employee ID" placeholder="EMP-003" {...register('employeeId')} />
          <Select label="Security Role" options={['Administrator', 'Accountant', 'Manager', 'SalesRep', 'InventoryClerk']} required {...register('role')} />
          {!editingUser && (
            <Input label="Temporary Password" type="password" defaultValue="Password123!" required {...register('password')} />
          )}
          <Input label="Authorized Branches (comma separated)" defaultValue="Main Branch, West Coast Branch" {...register('branches')} />
          <Input label="Authorized Warehouses" defaultValue="Main Warehouse, West Coast Depot" {...register('warehouses')} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete User"
        message="Are you sure you want to deactivate and remove this user account?"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
