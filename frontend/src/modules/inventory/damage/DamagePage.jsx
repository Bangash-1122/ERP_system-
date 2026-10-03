import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, ShieldAlert, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal } from '../../../components/ui/Card.jsx';
import { Input, Select, Textarea, Badge } from '../../../components/ui/Input.jsx';
import { inventoryApi } from '../inventory.api.js';
import { productsApi } from '../../products/products.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';

export function DamagePage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['stock-damages'],
    queryFn: inventoryApi.getDamages
  });

  const damages = response?.data || [];

  const { data: prodResponse } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts()
  });
  const products = prodResponse?.data || [];

  const { register, control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      warehouseName: 'Main Warehouse',
      reason: 'Transit / handling damage',
      items: [{ productSku: 'SKU-DRL-001', productName: 'Titanium Rotary Drill 850W', damagedQty: 1, unitCost: 85, totalLoss: 85 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const createMutation = useMutation({
    mutationFn: inventoryApi.createDamage,
    onSuccess: () => {
      queryClient.invalidateQueries(['stock-damages']);
      queryClient.invalidateQueries(['inventory-stock']);
      queryClient.invalidateQueries(['inventory-movements']);
      toast.success('Damaged inventory logged and stock deducted');
      setIsModalOpen(false);
      reset();
    }
  });

  const onSubmit = (formData) => {
    formData.items.forEach(item => {
      item.damagedQty = Number(item.damagedQty) || 1;
      item.unitCost = Number(item.unitCost) || 0;
      item.totalLoss = item.damagedQty * item.unitCost;
    });
    createMutation.mutate(formData);
  };

  const columns = [
    { key: 'damageNo', header: 'Damage Log ID', cellClassName: 'font-mono font-bold text-rose-700' },
    { key: 'date', header: 'Incident Date', render: (val) => formatDate(val) },
    { key: 'warehouseName', header: 'Warehouse' },
    { key: 'reason', header: 'Incident Reason', cellClassName: 'text-slate-700' },
    {
      key: 'items',
      header: 'Damaged Items',
      render: (items = []) => (
        <span className="font-semibold text-slate-900">
          {items.map(i => `${i.productSku} (${i.damagedQty} pcs)`).join(', ')}
        </span>
      )
    },
    {
      key: 'totalLoss',
      header: 'Loss Valuation',
      render: (_, row) => {
        const total = (row.items || []).reduce((s, i) => s + (Number(i.totalLoss) || (i.damagedQty * i.unitCost) || 0), 0);
        return <span className="font-bold text-rose-600">{formatCurrency(total)}</span>;
      }
    },
    {
      key: 'status',
      header: 'Disposal Status',
      render: (val) => <Badge size="sm">{val || 'Disposed'}</Badge>
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Damaged Inventory & Loss Logs"
        subtitle="Record warehouse handling damages, expired stock write-offs, and scrap quarantine"
        actions={
          <Button icon={Plus} variant="danger" onClick={() => setIsModalOpen(true)}>
            Record Damaged Stock
          </Button>
        }
      />

      <DataTable columns={columns} data={damages} isLoading={isLoading} title="Damage Records" exportFileName="damaged_stock_logs" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report Damaged Goods"
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
              Write-off Damaged Inventory
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Warehouse Location" options={['Main Warehouse', 'West Coast Depot']} required {...register('warehouseName')} />
            <Input label="Cause of Damage / Incident" placeholder="e.g. Water leak / Forklift impact" required {...register('reason')} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Damaged SKUs</label>
              <Button size="sm" variant="outline" icon={Plus} onClick={() => append({ productSku: products[0]?.sku || '', productName: products[0]?.name || '', damagedQty: 1, unitCost: 50, totalLoss: 50 })}>
                Add SKU
              </Button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <div className="col-span-6">
                    <label className="text-[10px] text-slate-500 font-semibold">SKU</label>
                    <select
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none"
                      {...register(`items.${index}.productSku`)}
                      onChange={(e) => {
                        const prod = products.find(p => p.sku === e.target.value);
                        if (prod) {
                          setValue(`items.${index}.productName`, prod.name);
                          setValue(`items.${index}.unitCost`, prod.costPrice);
                        }
                      }}
                    >
                      {products.map(p => (
                        <option key={p.sku} value={p.sku}>{p.name} ({p.sku})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-4">
                    <label className="text-[10px] text-slate-500 font-semibold">Damaged Quantity</label>
                    <input type="number" className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-bold text-rose-600" {...register(`items.${index}.damagedQty`)} />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)} className="p-1 text-rose-500 hover:bg-rose-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
