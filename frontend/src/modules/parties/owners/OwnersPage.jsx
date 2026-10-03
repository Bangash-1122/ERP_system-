import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { partiesApi } from '../parties.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export function OwnersPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['owners'],
    queryFn: partiesApi.getOwners
  });

  const owners = response?.data || [];

  const columns = [
    { key: 'name', header: 'Owner / Stakeholder', cellClassName: 'font-semibold text-slate-900' },
    {
      key: 'sharePercentage',
      header: 'Equity Share',
      render: (val) => <span className="font-bold text-sky-700">{val}%</span>
    },
    {
      key: 'capitalInvested',
      header: 'Capital Invested',
      render: (val) => formatCurrency(val)
    },
    {
      key: 'drawings',
      header: 'Cumulative Drawings',
      render: (val) => formatCurrency(val)
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Shareholders & Capital Owners"
        subtitle="Manage business equity ownership, capital injections, drawings, and share ratios"
      />
      <DataTable columns={columns} data={owners} isLoading={isLoading} title="Owners" exportFileName="equity_owners" />
    </div>
  );
}

export function PartnershipsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['partnerships'],
    queryFn: partiesApi.getPartnerships
  });

  const partnerships = response?.data || [];

  const columns = [
    { key: 'name', header: 'Partnership / JV Venture', cellClassName: 'font-semibold text-slate-900' },
    { key: 'partnerCount', header: 'Active Partners' },
    { key: 'profitSharingRatio', header: 'Profit Ratio (P:L)', cellClassName: 'font-bold font-mono text-sky-700' },
    {
      key: 'totalCapital',
      header: 'Joint Capital Pool',
      render: (val) => formatCurrency(val)
    },
    { key: 'status', header: 'Status' }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Joint Ventures & Partnerships"
        subtitle="Manage commercial partnership agreements, joint profit-sharing formulas, and capital pools"
      />
      <DataTable columns={columns} data={partnerships} isLoading={isLoading} title="Partnerships" exportFileName="partnerships_list" />
    </div>
  );
}

export function SarafPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['saraf'],
    queryFn: partiesApi.getSarafs
  });

  const sarafs = response?.data || [];

  const columns = [
    { key: 'code', header: 'Saraf Code', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'name', header: 'Exchange Dealer / Saraf', cellClassName: 'font-semibold text-slate-900' },
    { key: 'contactPerson', header: 'Market Trader' },
    { key: 'marketLocation', header: 'Bazaar / Market Location' },
    { key: 'phone', header: 'Phone Contact' },
    {
      key: 'currentBalance',
      header: 'Running Balance',
      render: (val, row) => `${formatCurrency(val, row.currency)}`
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Saraf & Currency Brokers"
        subtitle="Manage bullion dealers, hawaladar exchange brokers, and foreign remittance books"
      />
      <DataTable columns={columns} data={sarafs} isLoading={isLoading} title="Saraf Exchange" exportFileName="saraf_dealers" />
    </div>
  );
}
