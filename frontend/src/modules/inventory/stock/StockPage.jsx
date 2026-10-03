import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Boxes, AlertTriangle, CheckCircle2, DollarSign, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { PageHeader, KpiCard } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Badge } from '../../../components/ui/Input.jsx';
import { inventoryApi } from '../inventory.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';
import { useUiStore } from '../../../store/uiStore.js';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';

export function StockPage() {
  const { selectedWarehouse } = useUiStore();
  const [warehouseFilter, setWarehouseFilter] = useState('All');
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ['inventory-stock', warehouseFilter],
    queryFn: () => inventoryApi.getStock({ warehouse: warehouseFilter })
  });

  const stockBalances = response?.data || [];

  // Computed Summaries
  const totalOnHand = stockBalances.reduce((sum, s) => sum + (s.onHand || 0), 0);
  const totalReserved = stockBalances.reduce((sum, s) => sum + (s.reserved || 0), 0);
  const totalDamaged = stockBalances.reduce((sum, s) => sum + (s.damaged || 0), 0);
  const totalAvailable = stockBalances.reduce((sum, s) => sum + (s.available || 0), 0);
  const lowStockCount = stockBalances.filter((s) => s.available <= 15).length;
  const estimatedValuation = totalOnHand * 35.5;

  const columns = [
    { key: 'productSku', header: 'SKU', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'productName', header: 'Product Item', cellClassName: 'font-semibold text-slate-900' },
    { key: 'warehouseName', header: 'Warehouse Facility' },
    {
      key: 'available',
      header: 'Available Stock',
      render: (val) => (
        <span className={`font-bold px-2 py-0.5 rounded text-xs ${val <= 10 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-emerald-700 font-semibold'}`}>
          {val}
        </span>
      )
    },
    { key: 'reserved', header: 'Reserved (Orders)', cellClassName: 'text-amber-700 font-medium' },
    { key: 'damaged', header: 'Damaged / Hold', cellClassName: 'text-rose-600 font-medium' },
    {
      key: 'onHand',
      header: 'Total On Hand',
      cellClassName: 'font-bold text-slate-900'
    },
    {
      key: 'updatedAt',
      header: 'Last Movement',
      render: (val) => formatDate(val)
    },
    {
      key: 'status',
      header: 'Health Status',
      render: (_, row) => {
        if (row.available <= 0) return <Badge variant="danger">Out of Stock</Badge>;
        if (row.available <= 15) return <Badge variant="warning">Low Stock</Badge>;
        return <Badge variant="success">Optimal</Badge>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Stock Status"
        subtitle="Real-time multi-location warehouse inventory balances and reserved stock metrics"
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" icon={ArrowRightLeft} onClick={() => navigate('/inventory/transfers')}>
              Transfer Stock
            </Button>
          </div>
        }
      />

      {/* 6 Top Stock KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard title="Total Stock Units" value={totalOnHand.toLocaleString()} icon={Boxes} variant="primary" />
        <KpiCard title="Available to Sell" value={totalAvailable.toLocaleString()} icon={CheckCircle2} variant="success" />
        <KpiCard title="Reserved for Orders" value={totalReserved.toLocaleString()} icon={Boxes} variant="warning" />
        <KpiCard title="Damaged / Quarantine" value={totalDamaged.toLocaleString()} icon={ShieldAlert} variant="danger" />
        <KpiCard title="Low Stock SKUs" value={lowStockCount} icon={AlertTriangle} variant="danger" />
        <KpiCard title="Inventory Value" value={formatCurrency(estimatedValuation)} icon={DollarSign} variant="default" />
      </div>

      <DataTable
        columns={columns}
        data={stockBalances}
        isLoading={isLoading}
        title="Stock Balances"
        exportFileName="inventory_stock_balance"
        filterComponent={
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Warehouses</option>
            <option value="Main Warehouse">Main Warehouse</option>
            <option value="West Coast Depot">West Coast Depot</option>
          </select>
        }
      />
    </div>
  );
}
