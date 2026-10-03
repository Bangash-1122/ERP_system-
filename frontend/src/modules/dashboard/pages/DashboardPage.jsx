import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  Building2,
  Boxes,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Calendar,
  Layers,
  FileText,
  Plus,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { PageHeader, KpiCard } from '../../../components/common/KpiCard.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Input.jsx';
import { dashboardApi } from '../dashboard.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';
import { useUiStore } from '../../../store/uiStore.js';
import { useNavigate } from 'react-router-dom';

const PIE_COLORS = ['#0d9488', '#0284c7', '#8b5cf6', '#f59e0b', '#ec4899'];

// Helper to format date to YYYY-MM-DD
const toISODate = (d) => d.toISOString().split('T')[0];

export function DashboardPage() {
  const { selectedBranch, selectedWarehouse } = useUiStore();
  const navigate = useNavigate();

  // Date range presets state
  const [activePreset, setActivePreset] = useState('1year'); // 'today' | '7days' | '30days' | '1year' | 'custom'
  
  // Initialize default 1 Year range
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const [fromDate, setFromDate] = useState(toISODate(oneYearAgo));
  const [toDate, setToDate] = useState(toISODate(today));

  // Handler for preset clicks
  const applyPreset = (preset) => {
    setActivePreset(preset);
    const now = new Date();
    let start = new Date();

    if (preset === 'today') {
      // start is today
    } else if (preset === '7days') {
      start.setDate(now.getDate() - 7);
    } else if (preset === '30days') {
      start.setDate(now.getDate() - 30);
    } else if (preset === '1year') {
      start.setFullYear(now.getFullYear() - 1);
    }

    if (preset !== 'custom') {
      setFromDate(toISODate(start));
      setToDate(toISODate(now));
    }
  };

  const handleCustomDateChange = (type, val) => {
    setActivePreset('custom');
    if (type === 'from') setFromDate(val);
    if (type === 'to') setToDate(val);
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard', selectedBranch, selectedWarehouse, fromDate, toDate, activePreset],
    queryFn: () =>
      dashboardApi.getDashboardData({
        branch: selectedBranch,
        warehouse: selectedWarehouse,
        fromDate,
        toDate,
        range: activePreset
      })
  });

  const kpis = data?.kpis || {
    todaySales: 4520,
    todayPurchases: 2890,
    receivables: 20650,
    payables: 14800,
    cashBalance: 14500,
    bankBalance: 58200,
    currentStockValue: 89000,
    lowStockItems: 4
  };

  const charts = data?.charts || {};
  const recentSales = data?.recentTransactions?.sales || [];
  const recentPurchases = data?.recentTransactions?.purchases || [];

  return (
    <div className="space-y-6 w-full">
      {/* Header & Date Range Filter Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive ERP Dashboard</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              Live Real-time
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Operating metrics for <span className="font-semibold text-slate-700">{selectedBranch}</span> · {selectedWarehouse}
          </p>
        </div>

        {/* Date Filters & Fast Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Preset Buttons */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs border border-slate-200/80">
            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: '7D' },
              { id: '30days', label: '30D' },
              { id: '1year', label: '1 Year (365D)' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === p.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Explicit From Date & To Date Inputs */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <div className="flex items-center gap-1">
              <label className="text-[11px] text-slate-500 font-medium">From:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => handleCustomDateChange('from', e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs"
              />
            </div>
            <span className="text-slate-300">→</span>
            <div className="flex items-center gap-1">
              <label className="text-[11px] text-slate-500 font-medium">To:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => handleCustomDateChange('to', e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs"
              />
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex items-center gap-2">
            <Button size="sm" icon={Plus} onClick={() => navigate('/sales/create')}>
              New Sale
            </Button>
            <Button size="sm" variant="outline" icon={Plus} onClick={() => navigate('/purchases/create')}>
              New Purchase
            </Button>
            <button
              onClick={() => refetch()}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 8 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <KpiCard
          title="Period Sales"
          value={formatCurrency(kpis.todaySales)}
          change="+14.2%"
          changeType="positive"
          subtitle="Selected date window"
          icon={TrendingUp}
          variant="primary"
        />
        <KpiCard
          title="Period Purchases"
          value={formatCurrency(kpis.todayPurchases)}
          change="+5.8%"
          changeType="neutral"
          subtitle="Incoming procurement"
          icon={ShoppingCart}
          variant="default"
        />
        <KpiCard
          title="Total Receivables"
          value={formatCurrency(kpis.receivables)}
          change="-2.4%"
          changeType="positive"
          subtitle="Customer trade debt"
          icon={DollarSign}
          variant="success"
        />
        <KpiCard
          title="Total Payables"
          value={formatCurrency(kpis.payables)}
          change="+1.1%"
          changeType="negative"
          subtitle="Supplier liabilities"
          icon={CreditCard}
          variant="warning"
        />
        <KpiCard
          title="Cash in Hand"
          value={formatCurrency(kpis.cashBalance)}
          subtitle="Main drawers & petty cash"
          icon={DollarSign}
          variant="default"
        />
        <KpiCard
          title="Operating Bank Balance"
          value={formatCurrency(kpis.bankBalance)}
          change="+8.3%"
          changeType="positive"
          subtitle="Corporate active accounts"
          icon={Building2}
          variant="primary"
        />
        <KpiCard
          title="Current Stock Valuation"
          value={formatCurrency(kpis.currentStockValue)}
          subtitle="Valued at standard cost"
          icon={Boxes}
          variant="default"
        />
        <KpiCard
          title="Low Stock Warning"
          value={`${kpis.lowStockItems} Items`}
          subtitle="Below reorder threshold"
          icon={AlertOctagon}
          variant="danger"
          className="cursor-pointer"
          onClick={() => navigate('/inventory')}
        />
      </div>

      {/* Charts Grid Row 1: Sales vs Purchases Trend & Category Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Sales vs Purchases Area Chart */}
        <Card
          title="Sales vs Purchases Performance"
          subtitle={`Historical operational trend (${fromDate} to ${toDate})`}
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-teal-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Sales
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Purchases
              </span>
            </div>
          }
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.salesTrend || []} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="purchaseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#salesGrad)" name="Sales" />
                <Area type="monotone" dataKey="purchases" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#purchaseGrad)" name="Purchases" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue by Category Donut Chart */}
        <Card title="Revenue by Category" subtitle="Top product segment contributions">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.categoryRevenue || []}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(charts.categoryRevenue || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2">
            {(charts.categoryRevenue || []).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span className="text-slate-600 truncate max-w-[140px]">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Grid Row 2: Cashflow Trend & Receivables vs Payables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Cash Flow Bar Chart */}
        <Card title="Monthly Cash Flow Dynamics" subtitle="Net operational inflow versus cash outflow">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.cashFlow || []} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="inflow" fill="#0d9488" name="Cash Inflow" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" fill="#f43f5e" name="Cash Outflow" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Warehouse Stock Valuation */}
        <Card title="Stock Valuation by Warehouse" subtitle="Asset concentration across active facilities">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.warehouseStock || []} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis dataKey="warehouse" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Valuation']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="value" fill="#0284c7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Recent Sales Invoices */}
        <Card
          title="Recent Sales Invoices"
          subtitle="Latest client billing activity"
          action={
            <Button size="sm" variant="ghost" onClick={() => navigate('/sales')}>
              View All
            </Button>
          }
        >
          <div className="divide-y divide-slate-100 text-xs">
            {recentSales.map((sale) => (
              <div key={sale._id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{sale.customerName}</div>
                  <div className="text-[11px] text-slate-400">
                    {sale.saleNo} · {formatDate(sale.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{formatCurrency(sale.grandTotal)}</div>
                  <Badge size="sm">{sale.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Purchases */}
        <Card
          title="Recent Purchase Orders"
          subtitle="Procurement supplier transactions"
          action={
            <Button size="sm" variant="ghost" onClick={() => navigate('/purchases')}>
              View All
            </Button>
          }
        >
          <div className="divide-y divide-slate-100 text-xs">
            {recentPurchases.map((purchase) => (
              <div key={purchase._id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{purchase.supplierName}</div>
                  <div className="text-[11px] text-slate-400">
                    {purchase.purchaseNo} · {formatDate(purchase.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{formatCurrency(purchase.grandTotal)}</div>
                  <Badge size="sm">{purchase.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
