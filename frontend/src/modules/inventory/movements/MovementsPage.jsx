import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, ArrowDownRight, ArrowUpRight, ArrowRightLeft, ShieldAlert, Wrench } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Badge } from '../../../components/ui/Input.jsx';
import { inventoryApi } from '../inventory.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';

export function MovementsPage() {
  const [movementTypeFilter, setMovementTypeFilter] = useState('All');

  const { data: response, isLoading } = useQuery({
    queryKey: ['inventory-movements', movementTypeFilter],
    queryFn: () => inventoryApi.getMovements({ movementType: movementTypeFilter })
  });

  const movements = response?.data || [];

  const columns = [
    { key: 'movementNo', header: 'Movement No', cellClassName: 'font-mono font-bold text-sky-700' },
    {
      key: 'date',
      header: 'Timestamp',
      render: (val) => formatDate(val, 'dd MMM yyyy, HH:mm')
    },
    {
      key: 'productName',
      header: 'Product Item',
      cellClassName: 'font-semibold text-slate-900',
      render: (val, row) => (
        <div>
          <div>{val}</div>
          <div className="text-[11px] text-slate-400 font-mono">SKU: {row.productSku}</div>
        </div>
      )
    },
    { key: 'warehouseName', header: 'Warehouse' },
    {
      key: 'movementType',
      header: 'Movement Type',
      render: (val) => {
        const typeVariants = {
          Purchase: 'success',
          Sale: 'primary',
          Transfer: 'info',
          Return: 'warning',
          Damage: 'danger',
          Adjustment: 'purple'
        };
        return <Badge variant={typeVariants[val] || 'default'} size="sm">{val}</Badge>;
      }
    },
    { key: 'referenceNo', header: 'Document Ref', cellClassName: 'font-mono text-slate-600' },
    {
      key: 'qtyIn',
      header: 'Qty In (+)',
      render: (val) =>
        val > 0 ? (
          <span className="font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowDownRight className="w-3.5 h-3.5" /> +{val}
          </span>
        ) : (
          '-'
        )
    },
    {
      key: 'qtyOut',
      header: 'Qty Out (-)',
      render: (val) =>
        val > 0 ? (
          <span className="font-bold text-rose-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> -{val}
          </span>
        ) : (
          '-'
        )
    },
    {
      key: 'unitCost',
      header: 'Unit Cost',
      render: (val) => formatCurrency(val)
    },
    { key: 'createdBy', header: 'Executed By', cellClassName: 'text-slate-500' }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Stock Movement Ledger"
        subtitle="Complete immutable audit trail of every stock entry, shipment issue, transfer, and adjustment"
      />

      <DataTable
        columns={columns}
        data={movements}
        isLoading={isLoading}
        title="Stock Movements"
        exportFileName="stock_movement_ledger"
        filterComponent={
          <select
            value={movementTypeFilter}
            onChange={(e) => setMovementTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Movement Types</option>
            <option value="Purchase">Purchase (Stock In)</option>
            <option value="Sale">Sale (Stock Out)</option>
            <option value="Transfer">Warehouse Transfer</option>
            <option value="Return">Returns</option>
            <option value="Adjustment">Adjustment</option>
            <option value="Damage">Damage</option>
          </select>
        }
      />
    </div>
  );
}
