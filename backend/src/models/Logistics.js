import mongoose from 'mongoose';

export const Shipment = mongoose.model(
  'Shipment',
  new mongoose.Schema(
    {
      shipmentNo: { type: String, required: true, unique: true },
      orderNo: { type: String, required: true },
      orderType: { type: String, enum: ['Sale', 'Purchase', 'Transfer'], default: 'Sale' },
      date: { type: Date, default: Date.now },
      transporterName: { type: String, required: true },
      vehicleNo: { type: String, required: true },
      driverName: { type: String, default: '' },
      driverPhone: { type: String, default: '' },
      originWarehouse: { type: String, required: true },
      destination: { type: String, required: true },
      freightCost: { type: Number, default: 0 },
      trackingNo: { type: String, default: '' },
      status: {
        type: String,
        enum: ['Pending', 'Loaded', 'In Transit', 'Delivered', 'Cancelled'],
        default: 'Pending'
      },
      estimatedDelivery: { type: Date },
      actualDelivery: { type: Date },
      notes: { type: String, default: '' }
    },
    { timestamps: true }
  )
);

export const Vehicle = mongoose.model(
  'Vehicle',
  new mongoose.Schema(
    {
      vehicleNo: { type: String, required: true, unique: true },
      type: { type: String, enum: ['Truck', 'Van', 'Container', 'Pickup'], default: 'Truck' },
      capacityTons: { type: Number, default: 10 },
      driverName: { type: String, default: '' },
      driverPhone: { type: String, default: '' },
      transporter: { type: String, default: 'Internal Fleet' },
      status: { type: String, enum: ['Available', 'On Trip', 'Maintenance'], default: 'Available' }
    },
    { timestamps: true }
  )
);

export const Delivery = mongoose.model(
  'Delivery',
  new mongoose.Schema(
    {
      deliveryNo: { type: String, required: true, unique: true },
      shipmentNo: { type: String, required: true },
      customerName: { type: String, required: true },
      deliveryAddress: { type: String, required: true },
      deliveryDate: { type: Date, default: Date.now },
      receivedBy: { type: String, default: '' },
      signatureUrl: { type: String, default: '' },
      status: { type: String, enum: ['Scheduled', 'Out for Delivery', 'Delivered', 'Failed'], default: 'Delivered' },
      remarks: { type: String, default: '' }
    },
    { timestamps: true }
  )
);
