import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, SlidersHorizontal, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal } from '../../../components/ui/Card.jsx';
import { Input, Select, Textarea, Badge } from '../../../components/ui/Input.jsx';
import { inventoryApi } from '../inventory.api.js';
import { productsApi } from '../../products/products.api.js';
import { formatDate } from '../../../utils/formatDate.js';

export function AdjustmentsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['stock-adjustments'],
    queryFn: inventoryApi.getAdjustments
  });

  const adjustments = response?.data || [];

  const { data: prodResponse } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts()
  });
  const products = prodResponse?.data || [];

  const { register, control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      warehouseName: 'Main Warehouse',
      reason: 'Physical count audit variance',
      items: [{ productSku: 'SKU-DRL-001', productName: 'Titanium Rotary Drill 850W', currentStock: 145, adjustedStock: 148, difference: 3, unitCost: 85 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const createMutation = useMutation({
    mutationFn: inventoryApi.createAdjustment,
    onSuccess: () => {
      queryClient.invalidateQueries(['stock-adjustments']);
      queryClient.invalidateQueries(['inventory-stock']);
      queryClient.invalidateQueries(['inventory-movements']);
      toast.success('Stock adjustment posted to ledger');
      setIsModalOpen(false);
      reset();
    }
  });

  const onSubmit = (formData) => {
    formData.status = 'Posted';
    formData.items.forEach(item => {
      item.difference = Number(item.adjustedStock) - Number(item.currentStock);
      item.unitCost = Number(item.unitCost) || 0;
    });
    createMutation.mutate(formData);
  };

  const columns = [
    { key: 'adjustmentNo', header: 'Adjustment No', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'date', header: 'Date', render: (val) => formatDate(val) },
    { key: 'warehouseName', header: 'Warehouse' },
    { key: 'reason', header: 'Reason & Justification', cellClassName: 'text-slate-700' },
    {
      key: 'items',
      header: 'Adjustment Variance',
      render: (items = []) => (
        <span className="font-semibold text-slate-900">
          {items.map(i => `${i.productSku} (${i.difference > 0 ? '+' : ''}${i.difference})`).join(', ')}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge size="sm">{val || 'Posted'}</Badge>
    },
    { key: 'createdBy', header: 'Authorized By', cellClassName: 'text-slate-500' }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Stock Adjustments & Reconciliation"
        subtitle="Record physical stock count variance corrections, positive found stock, and negative shrinkage"
        actions={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Record Adjustment
          </Button>
        }
      />

      <DataTable columns={columns} data={adjustments} isLoading={isLoading} title="Adjustments" exportFileName="adjustments_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post Physical Stock Adjustment"
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
              Post to Inventory & Ledger
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Warehouse" options={['Main Warehouse', 'West Coast Depot']} required {...register('warehouseName')} />
            <Input label="Reason for Variance" placeholder="e.g. End of Quarter Physical Count" required {...register('reason')} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Adjustment Lines</label>
              <Button size="sm" variant="outline" icon={Plus} onClick={() => append({ productSku: products[0]?.sku || '', productName: products[0]?.name || '', currentStock: 10, adjustedStock: 10, difference: 0, unitCost: 50 })}>
                Add Line
              </Button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <div className="col-span-4">
                    <label className="text-[10px] text-slate-500 font-semibold">SKU</label>
                    <select
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none"
                      {...register(`items.${index}.productSku`)}
                      onChange={(e) => {
                        const prod = products.find(p => p.sku === e.target.value);
                        if (prod) {
                          setValue(`items.${index}.productName`, prod.name);
                          setValue(`items.${index}.currentStock`, prod.stock);
                          setValue(`items.${index}.adjustedStock`, prod.stock);
                          setValue(`items.${index}.unitCost`, prod.costPrice);
                        }
                      }}
                    >
                      {products.map(p => (
                        <option key={p.sku} value={p.sku}>{p.name} ({p.sku})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] text-slate-500 font-semibold">Current System Stock</label>
                    <input type="number" className="w-full bg-slate-100 border border-slate-300 rounded px-2 py-1 text-slate-600 font-medium" {...register(`items.${index}.currentStock`)} readOnly />
                  </div>
                  <div className="col-span-4">
                    <label className="text-[10px] text-slate-500 font-semibold">Actual Counted Stock</label>
                    <input type="number" className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-bold text-sky-700" {...register(`items.${index}.adjustedStock`)} />
                  </div>
                  <div className="col-span-1 flex justify-end">
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
