import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productSku: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, default: 'PCS' },
  packing: { type: String, default: 'Box' },
  unitPrice: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true }
});

const purchaseSchema = new mongoose.Schema(
  {
    purchaseNo: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    supplierName: { type: String, required: true },
    branch: { type: String, required: true, default: 'Main Branch' },
    warehouse: { type: String, required: true, default: 'Main Warehouse' },
    currency: { type: String, default: 'USD' },
    items: [itemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Draft', 'Approved', 'Posted', 'Cancelled'],
      default: 'Draft'
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partially Paid', 'Paid'],
      default: 'Unpaid'
    },
    notes: { type: String, default: '' },
    createdBy: { type: String, default: 'Admin' }
  },
  { timestamps: true }
);

export const Purchase = mongoose.model('Purchase', purchaseSchema);

export const PurchaseReturn = mongoose.model(
  'PurchaseReturn',
  new mongoose.Schema(
    {
      returnNo: { type: String, required: true, unique: true },
      originalPurchaseNo: { type: String, required: true },
      date: { type: Date, default: Date.now },
      supplierName: { type: String, required: true },
      branch: { type: String, required: true },
      warehouse: { type: String, required: true },
      items: [itemSchema],
      totalRefund: { type: Number, required: true },
      reason: { type: String, required: true },
      status: { type: String, enum: ['Draft', 'Approved', 'Completed'], default: 'Draft' },
      createdBy: { type: String, default: 'Admin' }
    },
    { timestamps: true }
  )
);

const saleSchema = new mongoose.Schema(
  {
    saleNo: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, required: true },
    branch: { type: String, required: true, default: 'Main Branch' },
    warehouse: { type: String, required: true, default: 'Main Warehouse' },
    currency: { type: String, default: 'USD' },
    items: [itemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    receivedAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Draft', 'Approved', 'Posted', 'Cancelled'],
      default: 'Draft'
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partially Paid', 'Paid'],
      default: 'Unpaid'
    },
    deliveryStatus: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered'],
      default: 'Pending'
    },
    notes: { type: String, default: '' },
    createdBy: { type: String, default: 'Admin' }
  },
  { timestamps: true }
);

export const Sale = mongoose.model('Sale', saleSchema);

export const SaleReturn = mongoose.model(
  'SaleReturn',
  new mongoose.Schema(
    {
      returnNo: { type: String, required: true, unique: true },
      originalSaleNo: { type: String, required: true },
      date: { type: Date, default: Date.now },
      customerName: { type: String, required: true },
      branch: { type: String, required: true },
      warehouse: { type: String, required: true },
      items: [itemSchema],
      totalRefund: { type: Number, required: true },
      reason: { type: String, required: true },
      status: { type: String, enum: ['Draft', 'Approved', 'Completed'], default: 'Draft' },
      createdBy: { type: String, default: 'Admin' }
    },
    { timestamps: true }
  )
);
