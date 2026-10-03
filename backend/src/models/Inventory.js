import mongoose from 'mongoose';

export const StockBalance = mongoose.model(
  'StockBalance',
  new mongoose.Schema(
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      productSku: { type: String, required: true },
      productName: { type: String, required: true },
      warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
      warehouseName: { type: String, required: true, default: 'Main Warehouse' },
      onHand: { type: Number, default: 0 },
      reserved: { type: Number, default: 0 },
      damaged: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
      lastMovementAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
  )
);

export const StockMovement = mongoose.model(
  'StockMovement',
  new mongoose.Schema(
    {
      movementNo: { type: String, required: true, unique: true },
      date: { type: Date, default: Date.now },
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productSku: { type: String, required: true },
      productName: { type: String, required: true },
      warehouseName: { type: String, required: true },
      movementType: {
        type: String,
        enum: ['Purchase', 'Sale', 'Transfer', 'Return', 'Damage', 'Adjustment'],
        required: true
      },
      referenceNo: { type: String, default: '' },
      qtyIn: { type: Number, default: 0 },
      qtyOut: { type: Number, default: 0 },
      unitCost: { type: Number, default: 0 },
      createdBy: { type: String, default: 'Admin' },
      notes: { type: String, default: '' }
    },
    { timestamps: true }
  )
);

export const WarehouseTransfer = mongoose.model(
  'WarehouseTransfer',
  new mongoose.Schema(
    {
      transferNo: { type: String, required: true, unique: true },
      transferDate: { type: Date, default: Date.now },
      sourceWarehouse: { type: String, required: true },
      destinationWarehouse: { type: String, required: true },
      reference: { type: String, default: '' },
      notes: { type: String, default: '' },
      items: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          productSku: { type: String, required: true },
          productName: { type: String, required: true },
          availableStock: { type: Number, default: 0 },
          transferQuantity: { type: Number, required: true },
          unit: { type: String, default: 'PCS' }
        }
      ],
      status: {
        type: String,
        enum: ['Draft', 'In Transit', 'Received', 'Cancelled'],
        default: 'Draft'
      },
      createdBy: { type: String, default: 'Admin' }
    },
    { timestamps: true }
  )
);

export const StockAdjustment = mongoose.model(
  'StockAdjustment',
  new mongoose.Schema(
    {
      adjustmentNo: { type: String, required: true, unique: true },
      date: { type: Date, default: Date.now },
      warehouseName: { type: String, required: true },
      reason: { type: String, required: true },
      items: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          productSku: { type: String, required: true },
          productName: { type: String, required: true },
          currentStock: { type: Number, default: 0 },
          adjustedStock: { type: Number, required: true },
          difference: { type: Number, required: true },
          unitCost: { type: Number, default: 0 }
        }
      ],
      status: { type: String, enum: ['Draft', 'Approved', 'Posted'], default: 'Draft' },
      createdBy: { type: String, default: 'Admin' }
    },
    { timestamps: true }
  )
);

export const StockDamage = mongoose.model(
  'StockDamage',
  new mongoose.Schema(
    {
      damageNo: { type: String, required: true, unique: true },
      date: { type: Date, default: Date.now },
      warehouseName: { type: String, required: true },
      reason: { type: String, required: true },
      items: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          productSku: { type: String, required: true },
          productName: { type: String, required: true },
          damagedQty: { type: Number, required: true },
          unitCost: { type: Number, default: 0 },
          totalLoss: { type: Number, default: 0 }
        }
      ],
      status: { type: String, enum: ['Reported', 'Approved', 'Disposed'], default: 'Reported' },
      createdBy: { type: String, default: 'Admin' }
    },
    { timestamps: true }
  )
);
