import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, ArrowRightLeft, ArrowRight, CheckCircle2, Clock, Truck, Trash2, Eye } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, Drawer } from '../../../components/ui/Card.jsx';
import { Input, Select, Textarea, Badge } from '../../../components/ui/Input.jsx';
import { inventoryApi } from '../inventory.api.js';
import { productsApi } from '../../products/products.api.js';
import { formatDate } from '../../../utils/formatDate.js';

export function TransfersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingTransfer, setViewingTransfer] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['warehouse-transfers'],
    queryFn: inventoryApi.getTransfers
  });

  const transfers = response?.data || [];

  const { data: prodResponse } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts()
  });
  const products = prodResponse?.data || [];

  const { register, control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      sourceWarehouse: 'Main Warehouse',
      destinationWarehouse: 'West Coast Depot',
      reference: '',
      notes: '',
      items: [{ productSku: 'SKU-DRL-001', productName: 'Titanium Rotary Drill 850W', transferQuantity: 10, unit: 'PCS' }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const createMutation = useMutation({
    mutationFn: inventoryApi.createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries(['warehouse-transfers']);
      toast.success('Warehouse transfer order created');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => inventoryApi.updateTransferStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['warehouse-transfers']);
      queryClient.invalidateQueries(['inventory-stock']);
      queryClient.invalidateQueries(['inventory-movements']);
      toast.success('Transfer status updated and stock movements processed');
      setViewingTransfer(null);
    }
  });

  const onSubmit = (formData) => {
    formData.status = 'In Transit';
    createMutation.mutate(formData);
  };

  const columns = [
    { key: 'transferNo', header: 'Transfer No', cellClassName: 'font-mono font-bold text-sky-700' },
    {
      key: 'transferDate',
      header: 'Transfer Date',
      render: (val) => formatDate(val)
    },
    {
      key: 'route',
      header: 'Warehouse Transit Path',
      render: (_, row) => (
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-800">{row.sourceWarehouse}</span>
          <ArrowRight className="w-3.5 h-3.5 text-sky-500" />
          <span className="font-semibold text-slate-800">{row.destinationWarehouse}</span>
        </div>
      )
    },
    {
      key: 'items',
      header: 'Items Dispatched',
      render: (items = []) => (
        <span className="font-medium text-slate-700">
          {items.length} SKU(s) ({items.reduce((s, i) => s + Number(i.transferQuantity || 0), 0)} total units)
        </span>
      )
    },
    { key: 'reference', header: 'Ref Code', cellClassName: 'font-mono text-slate-500' },
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
        <Button size="sm" variant="ghost" icon={Eye} onClick={() => setViewingTransfer(row)}>
          Details
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Inter-Warehouse Stock Transfers"
        subtitle="Manage cross-depot logistics, transit handoffs, and receiving confirmations"
        actions={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Initiate Transfer
          </Button>
        }
      />

      <DataTable columns={columns} data={transfers} isLoading={isLoading} title="Transfers" exportFileName="transfers_list" />

      {/* Transfer Detail Drawer with Visual Stepper Indicator */}
      <Drawer
        isOpen={Boolean(viewingTransfer)}
        onClose={() => setViewingTransfer(null)}
        title={`Transfer ${viewingTransfer?.transferNo || ''}`}
        footer={
          viewingTransfer?.status === 'In Transit' ? (
            <div className="flex gap-2">
              <Button
                variant="success"
                onClick={() => updateStatusMutation.mutate({ id: viewingTransfer._id, status: 'Received' })}
                isLoading={updateStatusMutation.isPending}
              >
                Mark as Received & Restock
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setViewingTransfer(null)}>
              Close
            </Button>
          )
        }
      >
        {viewingTransfer && (
          <div className="space-y-6 text-xs">
            {/* Visual Transfer Stepper */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Transfer Routing & Status</div>
              <div className="flex items-center justify-between relative px-2">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 mt-1">{viewingTransfer.sourceWarehouse}</span>
                  <span className="text-[10px] text-slate-400">Dispatched</span>
                </div>

                <div className="flex-1 h-0.5 bg-sky-300 mx-2" />

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${viewingTransfer.status === 'In Transit' ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-emerald-100 text-emerald-600'}`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 mt-1">In Transit</span>
                  <span className="text-[10px] text-slate-400">Haulage in Progress</span>
                </div>

                <div className={`flex-1 h-0.5 mx-2 ${viewingTransfer.status === 'Received' ? 'bg-sky-300' : 'bg-slate-200'}`} />

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${viewingTransfer.status === 'Received' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {viewingTransfer.status === 'Received' ? '✓' : '3'}
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 mt-1">{viewingTransfer.destinationWarehouse}</span>
                  <span className="text-[10px] text-slate-400">{viewingTransfer.status === 'Received' ? 'Stock Received' : 'Pending Arrival'}</span>
                </div>
              </div>
            </div>

            {/* Items Dispatched Table */}
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Transfer Manifest Items</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="p-2">Item Name</th>
                      <th className="p-2">SKU</th>
                      <th className="p-2 text-right">Transfer Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(viewingTransfer.items || []).map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-semibold text-slate-800">{it.productName}</td>
                        <td className="p-2 font-mono text-slate-500">{it.productSku}</td>
                        <td className="p-2 text-right font-bold text-slate-900">{it.transferQuantity} {it.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {viewingTransfer.notes && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">Notes & Transport Details</span>
                <p className="text-slate-700 mt-0.5">{viewingTransfer.notes}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* New Transfer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Initiate Inter-Warehouse Stock Transfer"
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
              Dispatch Transfer Order
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Source Warehouse (Origin)" options={['Main Warehouse', 'West Coast Depot']} required {...register('sourceWarehouse')} />
            <Select label="Destination Warehouse (Target)" options={['West Coast Depot', 'Main Warehouse']} required {...register('destinationWarehouse')} />
            <Input label="Reference / Waybill" placeholder="e.g. TRF-TRUCK-88" {...register('reference')} />
            <Input label="Transfer Date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} {...register('transferDate')} />
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dispatched Products</label>
              <Button size="sm" variant="outline" icon={Plus} onClick={() => append({ productSku: products[0]?.sku || 'SKU-DRL-001', productName: products[0]?.name || 'Drill', transferQuantity: 5, unit: 'PCS' })}>
                Add Line
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="col-span-6">
                    <label className="text-[10px] text-slate-500 font-semibold">Product SKU</label>
                    <select
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none"
                      {...register(`items.${index}.productSku`)}
                      onChange={(e) => {
                        const prod = products.find(p => p.sku === e.target.value);
                        if (prod) {
                          setValue(`items.${index}.productName`, prod.name);
                          setValue(`items.${index}.unit`, prod.unit);
                        }
                      }}
                    >
                      {products.map(p => (
                        <option key={p.sku} value={p.sku}>{p.name} ({p.sku})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-4">
                    <label className="text-[10px] text-slate-500 font-semibold">Quantity</label>
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none"
                      {...register(`items.${index}.transferQuantity`)}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Textarea label="Transfer Notes & Dispatch Instructions" placeholder="Driver name, vehicle registration, seal numbers..." {...register('notes')} />
        </form>
      </Modal>
    </div>
  );
}
