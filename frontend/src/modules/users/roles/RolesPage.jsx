import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, ShieldCheck, Check, X, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog, Card } from '../../../components/ui/Card.jsx';
import { Input, Textarea, Badge } from '../../../components/ui/Input.jsx';
import { usersApi } from '../users.api.js';

const MODULES = ['sales', 'purchases', 'inventory', 'accounting', 'logistics', 'users'];
const ACTIONS = ['create', 'read', 'update', 'delete', 'approve', 'post'];

export function RolesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [permissions, setPermissions] = useState(
    MODULES.reduce((acc, mod) => {
      acc[mod] = { create: true, read: true, update: true, delete: false, approve: false, post: false };
      return acc;
    }, {})
  );

  const { data: response, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: usersApi.getRoles
  });

  const roles = response?.data || [];
  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: usersApi.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      toast.success('Security role and permission matrix registered');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => usersApi.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      toast.success('Security role matrix updated');
      setIsModalOpen(false);
      setEditingRole(null);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      toast.success('Role deleted');
      setDeletingId(null);
    }
  });

  const handleOpenCreate = () => {
    setEditingRole(null);
    reset({ name: '', code: '', description: '' });
    setPermissions(
      MODULES.reduce((acc, mod) => {
        acc[mod] = { create: true, read: true, update: false, delete: false, approve: false, post: false };
        return acc;
      }, {})
    );
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r) => {
    setEditingRole(r);
    setValue('name', r.name);
    setValue('code', r.code);
    setValue('description', r.description);
    if (r.permissions) {
      setPermissions(r.permissions);
    }
    setIsModalOpen(true);
  };

  const togglePermission = (module, action) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module]?.[action]
      }
    }));
  };

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      permissions
    };
    if (editingRole) {
      updateMutation.mutate({ id: editingRole._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns = [
    { key: 'name', header: 'Role Title', cellClassName: 'font-semibold text-slate-900' },
    { key: 'code', header: 'Role Code', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'description', header: 'Description', cellClassName: 'text-slate-500' },
    {
      key: 'isSystem',
      header: 'System Protected',
      render: (val) => (val ? <Badge variant="primary" size="sm">System Master</Badge> : <Badge size="sm">Custom</Badge>)
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
          {!row.isSystem && (
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
        title="Roles & Permission Matrix"
        subtitle="Configure role-based access control (RBAC), module capabilities (Create, Read, Update, Delete, Approve, Post)"
        actions={
          <Button icon={Plus} onClick={handleOpenCreate}>
            Create Role
          </Button>
        }
      />

      <DataTable columns={columns} data={roles} isLoading={isLoading} title="Security Roles" exportFileName="roles_list" />

      {/* Role & Matrix Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? 'Edit Security Role & Matrix' : 'Configure New Role'}
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingRole ? 'Save Matrix Changes' : 'Save Role'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Role Title" placeholder="e.g. Regional Store Manager" required {...register('name')} />
            <Input label="Role Code (Unique)" placeholder="e.g. STORE_MGR" required {...register('code')} />
            <div className="sm:col-span-2">
              <Input label="Role Description" placeholder="Scope of responsibilities..." {...register('description')} />
            </div>
          </div>

          {/* Granular Permission Matrix Table */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              Granular Module Permission Matrix
            </label>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="p-2.5">ERP Module</th>
                    {ACTIONS.map(action => (
                      <th key={action} className="p-2.5 text-center capitalize">{action}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MODULES.map(module => (
                    <tr key={module} className="hover:bg-slate-50/70">
                      <td className="p-2.5 font-semibold text-slate-900 capitalize">{module}</td>
                      {ACTIONS.map(action => {
                        const isGranted = Boolean(permissions[module]?.[action]);
                        return (
                          <td key={action} className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => togglePermission(module, action)}
                              className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-colors cursor-pointer ${
                                isGranted ? 'bg-sky-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              {isGranted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3 h-3" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Role"
        message="Are you sure? Removing this role will revoke permissions from all assigned operators."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
