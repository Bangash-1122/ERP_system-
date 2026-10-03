import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, UserCheck, Edit2, Trash2, Mail, Phone, DollarSign } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Select, Badge } from '../../../components/ui/Input.jsx';
import { partiesApi } from '../parties.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';

export function EmployeesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: partiesApi.getEmployees
  });

  const employees = response?.data || [];
  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: partiesApi.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      toast.success('Employee created');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => partiesApi.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      toast.success('Employee record updated');
      setIsModalOpen(false);
      setEditingEmployee(null);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: partiesApi.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      toast.success('Employee record removed');
      setDeletingId(null);
    }
  });

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    reset({
      code: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      designation: 'Staff Associate',
      department: 'Operations',
      phone: '',
      email: '',
      salary: 60000,
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    setValue('code', emp.code);
    setValue('name', emp.name);
    setValue('designation', emp.designation);
    setValue('department', emp.department);
    setValue('phone', emp.phone);
    setValue('email', emp.email);
    setValue('salary', emp.salary);
    setValue('status', emp.status);
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    formData.salary = Number(formData.salary) || 0;
    if (editingEmployee) {
      updateMutation.mutate({ id: editingEmployee._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { key: 'code', header: 'Badge ID', cellClassName: 'font-mono font-bold text-sky-700' },
    {
      key: 'name',
      header: 'Employee Name',
      cellClassName: 'font-semibold text-slate-900',
      render: (val, row) => (
        <div>
          <div>{val}</div>
          <div className="text-[11px] text-slate-400">{row.email}</div>
        </div>
      )
    },
    { key: 'designation', header: 'Designation' },
    { key: 'department', header: 'Department' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'salary',
      header: 'Base Salary',
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
        title="Employee Directory & Staff"
        subtitle="Manage company staff, job designations, departments, compensation, and active statuses"
        actions={
          <Button icon={Plus} onClick={handleOpenCreate}>
            Add Employee
          </Button>
        }
      />

      <DataTable columns={columns} data={employees} isLoading={isLoading} title="Employees" exportFileName="employees_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? 'Edit Staff Details' : 'Register New Employee'}
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingEmployee ? 'Save Changes' : 'Create Employee'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Employee ID / Badge" required {...register('code')} />
          <Input label="Full Name" placeholder="e.g. Sarah Jenkins" required {...register('name')} />
          <Input label="Designation" placeholder="e.g. Senior Accountant" required {...register('designation')} />
          <Select label="Department" options={['Executive', 'Finance', 'Sales', 'Inventory', 'Logistics', 'Procurement']} required {...register('department')} />
          <Input label="Email" type="email" placeholder="sarah@nexus.com" {...register('email')} />
          <Input label="Phone Contact" placeholder="+1 (555) 000-0000" {...register('phone')} />
          <Input label="Annual Salary ($)" type="number" defaultValue="60000" required {...register('salary')} />
          <Select label="Status" options={['Active', 'Inactive', 'Terminated']} {...register('status')} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Employee"
        message="Are you sure you want to remove this employee record?"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
