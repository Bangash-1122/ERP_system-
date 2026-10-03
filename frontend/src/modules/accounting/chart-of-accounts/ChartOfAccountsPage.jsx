import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Plus,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Folder,
  FileCode,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog } from '../../../components/ui/Card.jsx';
import { Input, Select, Badge } from '../../../components/ui/Input.jsx';
import { accountingApi } from '../accounting.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export function ChartOfAccountsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTypes, setExpandedTypes] = useState({
    Asset: true,
    Liability: true,
    Equity: true,
    Revenue: true,
    Expense: true
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: accountingApi.getAccounts
  });

  const accounts = response?.data || [];

  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: accountingApi.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(['chart-of-accounts']);
      toast.success('Account added to Chart of Accounts');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => accountingApi.updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['chart-of-accounts']);
      toast.success('Account updated');
      setIsModalOpen(false);
      setEditingAccount(null);
      reset();
    }
  });

  const handleOpenCreate = (type = 'Asset') => {
    setEditingAccount(null);
    reset({
      code: `1${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      type,
      category: 'General',
      balance: 0,
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc) => {
    setEditingAccount(acc);
    setValue('code', acc.code);
    setValue('name', acc.name);
    setValue('type', acc.type);
    setValue('category', acc.category);
    setValue('status', acc.status);
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    formData.balance = Number(formData.balance) || 0;
    if (editingAccount) {
      updateMutation.mutate({ id: editingAccount._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleType = (t) => {
    setExpandedTypes(prev => ({ ...prev, [t]: !prev[t] }));
  };

  const accountTypes = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

  const filteredAccounts = accounts.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chart of Accounts"
        subtitle="Double-entry general ledger structural tree (Assets, Liabilities, Equity, Revenue, Expenses)"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setExpandedTypes({
                  Asset: true,
                  Liability: true,
                  Equity: true,
                  Revenue: true,
                  Expense: true
                })
              }
            >
              Expand All
            </Button>
            <Button icon={Plus} onClick={() => handleOpenCreate('Asset')}>
              Add Account
            </Button>
          </div>
        }
      />

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search GL accounts by code or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500"
        />
      </div>

      {/* Interactive Tree View */}
      <div className="space-y-4">
        {accountTypes.map((type) => {
          const typeAccounts = filteredAccounts.filter(a => a.type === type);
          const isExpanded = expandedTypes[type];
          const totalBalance = typeAccounts.reduce((s, a) => s + (a.balance || 0), 0);

          const typeColors = {
            Asset: 'border-l-sky-500 text-sky-700 bg-sky-50/40',
            Liability: 'border-l-amber-500 text-amber-700 bg-amber-50/40',
            Equity: 'border-l-purple-500 text-purple-700 bg-purple-50/40',
            Revenue: 'border-l-emerald-500 text-emerald-700 bg-emerald-50/40',
            Expense: 'border-l-rose-500 text-rose-700 bg-rose-50/40'
          };

          return (
            <div key={type} className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              {/* Type Head */}
              <div
                onClick={() => toggleType(type)}
                className={`px-4 py-3 border-l-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors ${typeColors[type]}`}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  <Folder className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-wider">{type} Accounts</span>
                  <span className="text-xs text-slate-400 font-medium">({typeAccounts.length} accounts)</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="font-semibold text-slate-700">Subtotal: {formatCurrency(totalBalance)}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Plus}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCreate(type);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Child Account Rows */}
              {isExpanded && (
                <div className="divide-y divide-slate-100 text-xs">
                  {typeAccounts.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs">No accounts registered under {type}.</div>
                  ) : (
                    typeAccounts.map((acc) => (
                      <div
                        key={acc._id}
                        className="px-6 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileCode className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono font-bold text-sky-700 w-16">{acc.code}</span>
                          <span className="font-semibold text-slate-900">{acc.name}</span>
                          <span className="text-[11px] text-slate-400">({acc.category})</span>
                        </div>

                        <div className="flex items-center gap-6">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {formatCurrency(acc.balance)}
                          </span>
                          <Badge size="sm">{acc.status || 'Active'}</Badge>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(acc)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAccount ? 'Edit Account' : 'Add GL Account'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingAccount ? 'Save Changes' : 'Create Account'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Account Code (GL)" placeholder="e.g. 1050" required {...register('code')} />
          <Input label="Account Title" placeholder="e.g. Petty Cash Vault" required {...register('name')} />
          <Select label="Account Type" options={accountTypes} required {...register('type')} />
          <Input label="Category Classification" placeholder="e.g. Cash, Receivables, Operations" required {...register('category')} />
          {!editingAccount && (
            <Input label="Opening Balance ($)" type="number" step="0.01" defaultValue="0" {...register('balance')} />
          )}
          <Select label="Status" options={['Active', 'Inactive']} {...register('status')} />
        </form>
      </Modal>
    </div>
  );
}
