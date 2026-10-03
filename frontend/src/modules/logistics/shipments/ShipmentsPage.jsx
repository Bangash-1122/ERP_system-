import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Truck, Edit2, Trash2, MapPin, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal } from '../../../components/ui/Card.jsx';
import { Input, Select, Textarea, Badge } from '../../../components/ui/Input.jsx';
import { logisticsApi } from '../logistics.api.js';
import { partiesApi } from '../../parties/parties.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';

export function ShipmentsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['shipments'],
    queryFn: () => logisticsApi.getShipments()
  });

  const shipments = response?.data || [];

  const { data: transResponse } = useQuery({ queryKey: ['transporters'], queryFn: partiesApi.getTransporters });
  const transporters = transResponse?.data || [];

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      orderNo: 'INV-00001',
      orderType: 'Sale',
      date: new Date().toISOString().slice(0, 10),
      transporterName: 'FastFreight Express Logistics',
      vehicleNo: 'TRK-9821-NY',
      driverName: 'Robert Lang',
      driverPhone: '+1 555-443-2211',
      originWarehouse: 'Main Warehouse',
      destination: 'Apex Manufacturing Facility, Chicago',
      freightCost: 450,
      trackingNo: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'In Transit'
    }
  });

  const createMutation = useMutation({
    mutationFn: logisticsApi.createShipment,
    onSuccess: () => {
      queryClient.invalidateQueries(['shipments']);
      toast.success('Shipment manifest booked');
      setIsModalOpen(false);
      reset();
    }
  });

  const onSubmit = (formData) => {
    formData.freightCost = Number(formData.freightCost) || 0;
    createMutation.mutate(formData);
  };

  const columns = [
    { key: 'shipmentNo', header: 'Waybill No', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'orderNo', header: 'Order Ref', cellClassName: 'font-mono text-slate-700' },
    { key: 'date', header: 'Dispatch Date', render: (val) => formatDate(val) },
    { key: 'transporterName', header: 'Freight Carrier', cellClassName: 'font-semibold text-slate-900' },
    { key: 'vehicleNo', header: 'Vehicle Plate', cellClassName: 'font-mono font-medium' },
    { key: 'destination', header: 'Destination Address', cellClassName: 'text-slate-600' },
    {
      key: 'freightCost',
      header: 'Freight Cost',
      render: (val) => formatCurrency(val)
    },
    {
      key: 'status',
      header: 'Transit Status',
      render: (val) => <Badge size="sm">{val}</Badge>
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Freight Shipments & Haulage"
        subtitle="Manage logistics dispatches, waybills, driver contacts, and consignment tracking"
        actions={
          <Button icon={Plus} onClick={() => { reset(); setIsModalOpen(true); }}>
            Dispatch Shipment
          </Button>
        }
      />

      <DataTable columns={columns} data={shipments} isLoading={isLoading} title="Shipments" exportFileName="shipments_list" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Freight Dispatch Manifest"
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
              Issue Waybill & Dispatch
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Order Document No" placeholder="e.g. INV-00001" required {...register('orderNo')} />
          <Select label="Order Classification" options={['Sale', 'Purchase', 'Transfer']} required {...register('orderType')} />
          <Select label="Carrier / Transporter" options={transporters.map(t => t.name)} required {...register('transporterName')} />
          <Input label="Vehicle Registration / Plate" placeholder="e.g. TRK-9821-NY" required {...register('vehicleNo')} />
          <Input label="Driver Name" placeholder="e.g. Robert Lang" required {...register('driverName')} />
          <Input label="Driver Phone Contact" placeholder="+1 (555) 000-0000" {...register('driverPhone')} />
          <Select label="Origin Warehouse" options={['Main Warehouse', 'West Coast Depot']} required {...register('originWarehouse')} />
          <Input label="Freight Charges ($)" type="number" step="0.01" defaultValue="450" required {...register('freightCost')} />
          <div className="md:col-span-2">
            <Input label="Delivery Destination" placeholder="Full address / Client unloading bay" required {...register('destination')} />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export function VehiclesPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: logisticsApi.getVehicles
  });

  const vehicles = response?.data || [];

  const columns = [
    { key: 'vehicleNo', header: 'Plate / Registration', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'type', header: 'Vehicle Type', cellClassName: 'font-semibold text-slate-900' },
    {
      key: 'capacityTons',
      header: 'Payload Capacity',
      render: (val) => `${val} Tons`
    },
    { key: 'driverName', header: 'Assigned Driver' },
    { key: 'driverPhone', header: 'Driver Phone' },
    { key: 'transporter', header: 'Fleet Ownership' },
    {
      key: 'status',
      header: 'Fleet Status',
      render: (val) => <Badge size="sm">{val}</Badge>
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Vehicle Fleet Directory"
        subtitle="Manage logistics trucks, delivery vans, capacity payloads, and dedicated fleet drivers"
      />
      <DataTable columns={columns} data={vehicles} isLoading={isLoading} title="Vehicles" exportFileName="vehicles_fleet" />
    </div>
  );
}

export function DeliveriesPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['deliveries'],
    queryFn: logisticsApi.getDeliveries
  });

  const deliveries = response?.data || [];

  const columns = [
    { key: 'deliveryNo', header: 'Proof of Delivery (POD)', cellClassName: 'font-mono font-bold text-sky-700' },
    { key: 'shipmentNo', header: 'Shipment Ref', cellClassName: 'font-mono text-slate-700' },
    { key: 'deliveryDate', header: 'Delivery Date', render: (val) => formatDate(val) },
    { key: 'customerName', header: 'Recipient Customer', cellClassName: 'font-semibold text-slate-900' },
    { key: 'receivedBy', header: 'Received & Signed By' },
    { key: 'deliveryAddress', header: 'Destination Address', cellClassName: 'text-slate-600' },
    {
      key: 'status',
      header: 'Delivery Status',
      render: (val) => <Badge size="sm">{val}</Badge>
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Proof of Delivery & Handover"
        subtitle="Track final customer destination handoffs, signatures, and delivery confirmations"
      />
      <DataTable columns={columns} data={deliveries} isLoading={isLoading} title="Deliveries" exportFileName="deliveries_list" />
    </div>
  );
}
