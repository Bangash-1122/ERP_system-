import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, CreditCard, DollarSign } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal } from '../../../components/ui/Card.jsx';
import { Input, Select, Textarea, Badge } from '../../../components/ui/Input.jsx';
import { financeApi } from '../finance.api.js';
import { partiesApi } from '../../parties/parties.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';

export function PaymentsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => financeApi.getPayments()
  });

  const payments = response?.data || [];

  const { data: supResponse } = useQuery({ queryKey: ['suppliers'], queryFn: partiesApi.getSuppliers });
  const suppliers = supResponse?.data || [];

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      partyType: 'Supplier',
      partyName: '',
      paymentMode: 'Bank Transfer',
      accountPaidFrom: 'Main Corporate Operating Bank',
      amount: 0,
      referenceNo: '',
      notes: ''
    }
  });

  const createMutation = useMutation({
    mutationFn: financeApi.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      queryClient.invalidateQueries(['suppliers']);
      queryClient.invalidateQueries(['chart-of-accounts']);
      toast.success('Payment voucher recorded and supplier account credited');
      setIsModalOpen(false);
      reset();
    }
  });

  const onSubmit = (formData) => {
    formData.amount = Number(formData.amount) || 0;
    formData.status = 'Completed';
    createMutation.mutate(formData);
  };

  const columns = [
    { key: 'paymentNo', header: 'Payment Ref No', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'date', header: 'Payment Date', render: (val) => formatDate(val) },
    { key: 'partyName', header: 'Paid To (Beneficiary)', cellClassName: 'font-semibold text-slate-900' },
    { key: 'paymentMode', header: 'Payment Mode', cellClassName: 'font-medium' },
    { key: 'accountPaidFrom', header: 'Disbursed From' },
    {
      key: 'amount',
      header: 'Amount Paid',
      render: (val) => <span className="font-bold text-rose-600">{formatCurrency(val)}</span>
    },
    { key: 'referenceNo', header: 'Bank Wire / Cheque Ref', cellClassName: 'font-mono text-slate-500' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge size="sm">{val || 'Completed'}</Badge>
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Outgoing Payments"
        subtitle="Record vendor disbursements, transport payouts, operating expenses, and accounts payable settlements"
        actions={
          <Button icon={Plus} onClick={() => { reset(); setIsModalOpen(true); }}>
            Record Payment
          </Button>
        }
      />

      <DataTable columns={columns} data={payments} isLoading={isLoading} title="Payments" exportFileName="payments_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Disburse Vendor / Expense Payment"
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
              Confirm & Post Payment
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Payment Date" type="date" required {...register('date')} />
          <Select label="Party Type" options={['Supplier', 'Transporter', 'Expense', 'Other']} required {...register('partyType')} />
          <Select label="Select Beneficiary" options={suppliers.map(s => s.name)} required {...register('partyName')} />
          <Select label="Payment Mode" options={['Bank Transfer', 'Cash', 'Cheque', 'Online']} required {...register('paymentMode')} />
          <Select label="Disburse From Account" options={['Main Corporate Operating Bank', 'Petty Cash / Cash Drawer']} required {...register('accountPaidFrom')} />
          <Input label="Amount Disbursed ($)" type="number" step="0.01" required {...register('amount')} />
          <div className="md:col-span-2">
            <Input label="Bank Transaction Ref / Cheque No" placeholder="e.g. WIRE-998811" {...register('referenceNo')} />
          </div>
          <div className="md:col-span-2">
            <Textarea label="Payment Narration & Memo" placeholder="Settlement for PO #PUR-00001..." {...register('notes')} />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export function ReceiptsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['receipts'],
    queryFn: () => financeApi.getReceipts()
  });

  const receipts = response?.data || [];

  const { data: custResponse } = useQuery({ queryKey: ['customers'], queryFn: partiesApi.getCustomers });
  const customers = custResponse?.data || [];

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      partyType: 'Customer',
      partyName: '',
      receiptMode: 'Bank Transfer',
      accountDepositedTo: 'Main Corporate Operating Bank',
      amount: 0,
      referenceNo: '',
      notes: ''
    }
  });

  const createMutation = useMutation({
    mutationFn: financeApi.createReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries(['receipts']);
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['chart-of-accounts']);
      toast.success('Money receipt generated and customer balance credited');
      setIsModalOpen(false);
      reset();
    }
  });

  const onSubmit = (formData) => {
    formData.amount = Number(formData.amount) || 0;
    formData.status = 'Completed';
    createMutation.mutate(formData);
  };

  const columns = [
    { key: 'receiptNo', header: 'Receipt No', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'date', header: 'Receipt Date', render: (val) => formatDate(val) },
    { key: 'partyName', header: 'Received From (Customer)', cellClassName: 'font-semibold text-slate-900' },
    { key: 'receiptMode', header: 'Mode', cellClassName: 'font-medium' },
    { key: 'accountDepositedTo', header: 'Deposited To' },
    {
      key: 'amount',
      header: 'Amount Received',
      render: (val) => <span className="font-bold text-emerald-700">{formatCurrency(val)}</span>
    },
    { key: 'referenceNo', header: 'Transaction Ref', cellClassName: 'font-mono text-slate-500' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge size="sm">{val || 'Completed'}</Badge>
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Incoming Receipts (Money In)"
        subtitle="Record client payments, customer receivables collection, owner capital deposits, and income receipts"
        actions={
          <Button icon={Plus} onClick={() => { reset(); setIsModalOpen(true); }}>
            Record Receipt
          </Button>
        }
      />

      <DataTable columns={columns} data={receipts} isLoading={isLoading} title="Receipts" exportFileName="receipts_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Customer Receipt / Deposit"
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
              Issue Official Receipt
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Receipt Date" type="date" required {...register('date')} />
          <Select label="Party Type" options={['Customer', 'Owner', 'Other']} required {...register('partyType')} />
          <Select label="Customer" options={customers.map(c => c.name)} required {...register('partyName')} />
          <Select label="Receipt Mode" options={['Bank Transfer', 'Cash', 'Cheque', 'POS']} required {...register('receiptMode')} />
          <Select label="Deposit Into Account" options={['Main Corporate Operating Bank', 'Petty Cash / Cash Drawer']} required {...register('accountDepositedTo')} />
          <Input label="Amount Received ($)" type="number" step="0.01" required {...register('amount')} />
          <div className="md:col-span-2">
            <Input label="Bank Transfer Ref / Cheque No" placeholder="e.g. ACH-992147" {...register('referenceNo')} />
          </div>
          <div className="md:col-span-2">
            <Textarea label="Receipt Narration & Remarks" placeholder="Payment received for INV-00001..." {...register('notes')} />
          </div>
        </form>
      </Modal>
    </div>
  );
}
