import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowLeft, Printer, Save, Send } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input, Select, Textarea } from '../../../components/ui/Input.jsx';
import { salesApi } from '../sales.api.js';
import { productsApi } from '../../products/products.api.js';
import { partiesApi } from '../../parties/parties.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export function SalesFormPage() {
  const navigate = useNavigate();

  const { data: prodResponse } = useQuery({ queryKey: ['products'], queryFn: () => productsApi.getProducts() });
  const products = prodResponse?.data || [];

  const { data: custResponse } = useQuery({ queryKey: ['customers'], queryFn: partiesApi.getCustomers });
  const customers = custResponse?.data || [];

  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      customerName: '',
      branch: 'Main Branch',
      warehouse: 'Main Warehouse',
      currency: 'USD',
      discount: 0,
      tax: 0,
      receivedAmount: 0,
      notes: '',
      items: [
        { productSku: 'SKU-DRL-001', productName: 'Titanium Rotary Drill 850W', quantity: 2, unit: 'PCS', packing: 'Box', unitPrice: 149.99, discount: 0, tax: 0, total: 299.98 }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const watchItems = watch('items');
  const watchDiscount = watch('discount') || 0;
  const watchTax = watch('tax') || 0;
  const watchReceived = watch('receivedAmount') || 0;

  const subtotal = (watchItems || []).reduce((sum, item) => {
    const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0) - (Number(item.discount) || 0) + (Number(item.tax) || 0);
    return sum + itemTotal;
  }, 0);

  const grandTotal = Math.max(0, subtotal - Number(watchDiscount) + Number(watchTax));
  const balance = Math.max(0, grandTotal - Number(watchReceived));

  const createMutation = useMutation({
    mutationFn: salesApi.createSale,
    onSuccess: () => {
      toast.success('Sales invoice created successfully');
      navigate('/sales');
    }
  });

  const onSubmit = (formData, status = 'Draft') => {
    formData.status = status;
    formData.subtotal = subtotal;
    formData.grandTotal = grandTotal;
    formData.balanceAmount = balance;
    formData.items.forEach(it => {
      it.quantity = Number(it.quantity);
      it.unitPrice = Number(it.unitPrice);
      it.total = (it.quantity * it.unitPrice) - (Number(it.discount) || 0) + (Number(it.tax) || 0);
    });
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Sales Invoice"
        subtitle="Generate client commercial invoice, check stock levels, apply discounts, and post billing"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={ArrowLeft} onClick={() => navigate('/sales')}>
              Back to Invoices
            </Button>
            <Button variant="outline" size="sm" icon={Printer} onClick={() => window.print()}>
              Print Invoice
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit((d) => onSubmit(d, 'Draft'))} className="space-y-6">
        <Card title="Customer & Billing Header" subtitle="General sales parameters and dispatch location">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Select Customer"
              options={customers.map(c => c.name)}
              required
              {...register('customerName')}
            />
            <Input label="Invoice Date" type="date" required {...register('date')} />
            <Select label="Selling Branch" options={['Main Branch', 'West Coast Branch']} required {...register('branch')} />
            <Select label="Dispatch Warehouse" options={['Main Warehouse', 'West Coast Depot']} required {...register('warehouse')} />
          </div>
        </Card>

        {/* Invoice Items Table */}
        <Card
          title="Invoice Line Items"
          subtitle="Add SKUs, sale quantities, and unit pricing"
          action={
            <Button
              size="sm"
              variant="outline"
              icon={Plus}
              onClick={() =>
                append({
                  productSku: products[0]?.sku || '',
                  productName: products[0]?.name || '',
                  quantity: 1,
                  unit: 'PCS',
                  packing: 'Box',
                  unitPrice: products[0]?.salePrice || 0,
                  discount: 0,
                  tax: 0,
                  total: 0
                })
              }
            >
              Add Item Line
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="p-2.5 min-w-[200px]">Product SKU</th>
                  <th className="p-2.5 w-24">Qty</th>
                  <th className="p-2.5 w-20">Unit</th>
                  <th className="p-2.5 w-28">Sale Price</th>
                  <th className="p-2.5 w-24">Discount</th>
                  <th className="p-2.5 w-24">Tax</th>
                  <th className="p-2.5 w-28 text-right">Line Total</th>
                  <th className="p-2.5 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fields.map((field, index) => {
                  const qty = Number(watchItems?.[index]?.quantity) || 0;
                  const price = Number(watchItems?.[index]?.unitPrice) || 0;
                  const disc = Number(watchItems?.[index]?.discount) || 0;
                  const tx = Number(watchItems?.[index]?.tax) || 0;
                  const rowTotal = (qty * price) - disc + tx;

                  return (
                    <tr key={field.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5">
                        <select
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-sky-500 text-xs font-semibold text-slate-800"
                          {...register(`items.${index}.productSku`)}
                          onChange={(e) => {
                            const p = products.find(prod => prod.sku === e.target.value);
                            if (p) {
                              setValue(`items.${index}.productName`, p.name);
                              setValue(`items.${index}.unitPrice`, p.salePrice);
                              setValue(`items.${index}.unit`, p.unit);
                            }
                          }}
                        >
                          {products.map(p => (
                            <option key={p.sku} value={p.sku}>{p.name} ({p.sku})</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="1"
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-center font-bold focus:outline-none focus:border-sky-500"
                          {...register(`items.${index}.quantity`)}
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          className="w-full bg-slate-100 border border-slate-300 rounded px-2 py-1.5 text-center text-slate-600"
                          {...register(`items.${index}.unit`)}
                          readOnly
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          step="0.01"
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-mono focus:outline-none focus:border-sky-500 font-semibold"
                          {...register(`items.${index}.unitPrice`)}
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          step="0.01"
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-mono focus:outline-none"
                          {...register(`items.${index}.discount`)}
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          step="0.01"
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-mono focus:outline-none"
                          {...register(`items.${index}.tax`)}
                        />
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900">
                        {formatCurrency(rowTotal)}
                      </td>
                      <td className="p-2.5 text-center">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Terms & Customer Instructions">
            <Textarea
              rows={4}
              placeholder="Payment due upon receipt, bank wire instructions, delivery remarks..."
              {...register('notes')}
            />
          </Card>

          <Card title="Invoice Financial Total" className="bg-slate-50/50">
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Gross Subtotal:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Special Invoice Discount:</span>
                <input
                  type="number"
                  className="w-28 bg-white border border-slate-300 rounded px-2 py-1 text-right font-mono"
                  {...register('discount')}
                />
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Sales Tax / VAT:</span>
                <input
                  type="number"
                  className="w-28 bg-white border border-slate-300 rounded px-2 py-1 text-right font-mono"
                  {...register('tax')}
                />
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                <span>Grand Total:</span>
                <span className="text-base text-sky-700">{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 pt-1">
                <span>Payment Received (Deposit):</span>
                <input
                  type="number"
                  className="w-28 bg-white border border-slate-300 rounded px-2 py-1 text-right font-mono font-semibold"
                  {...register('receivedAmount')}
                />
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-xs">
                <span>Remaining Due:</span>
                <span className={balance > 0 ? 'text-rose-600' : 'text-emerald-700'}>{formatCurrency(balance)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={() => navigate('/sales')}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="secondary"
            icon={Save}
            isLoading={createMutation.isPending}
          >
            Save Draft Invoice
          </Button>
          <Button
            type="button"
            variant="primary"
            icon={Send}
            onClick={handleSubmit((d) => onSubmit(d, 'Posted'))}
            isLoading={createMutation.isPending}
          >
            Post Invoice & Deduct Stock
          </Button>
        </div>
      </form>
    </div>
  );
}
