import mongoose from 'mongoose';

// Organization Models
export const Branch = mongoose.model(
  'Branch',
  new mongoose.Schema(
    {
      code: { type: String, required: true, unique: true, uppercase: true },
      name: { type: String, required: true },
      city: { type: String, default: '' },
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      isHeadOffice: { type: Boolean, default: false },
      status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
    },
    { timestamps: true }
  )
);

export const Warehouse = mongoose.model(
  'Warehouse',
  new mongoose.Schema(
    {
      code: { type: String, required: true, unique: true, uppercase: true },
      name: { type: String, required: true },
      branch: { type: String, required: true, default: 'Main Branch' },
      location: { type: String, default: '' },
      capacity: { type: Number, default: 10000 },
      isPrimary: { type: Boolean, default: false },
      status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
    },
    { timestamps: true }
  )
);

export const Shop = mongoose.model(
  'Shop',
  new mongoose.Schema(
    {
      code: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      branch: { type: String, required: true },
      warehouse: { type: String, default: '' },
      phone: { type: String, default: '' },
      status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
    },
    { timestamps: true }
  )
);

export const Currency = mongoose.model(
  'Currency',
  new mongoose.Schema(
    {
      code: { type: String, required: true, unique: true, uppercase: true },
      name: { type: String, required: true },
      symbol: { type: String, required: true },
      exchangeRate: { type: Number, default: 1.0 },
      isBase: { type: Boolean, default: false },
      status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
    },
    { timestamps: true }
  )
);

// Products & Catalog
export const Category = mongoose.model(
  'Category',
  new mongoose.Schema(
    {
      code: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      parentCategory: { type: String, default: null },
      description: { type: String, default: '' },
      status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
    },
    { timestamps: true }
  )
);

export const QuantityUnit = mongoose.model(
  'QuantityUnit',
  new mongoose.Schema(
    {
      code: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      symbol: { type: String, required: true },
      status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
    },
    { timestamps: true }
  )
);

export const PackingUnit = mongoose.model(
  'PackingUnit',
  new mongoose.Schema(
    {
      code: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      baseQuantity: { type: Number, default: 1 },
      quantityUnit: { type: String, default: 'PCS' },
      status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
    },
    { timestamps: true }
  )
);

export const Product = mongoose.model(
  'Product',
  new mongoose.Schema(
    {
      sku: { type: String, required: true, unique: true, uppercase: true },
      barcode: { type: String, default: '' },
      name: { type: String, required: true },
      category: { type: String, default: 'General' },
      unit: { type: String, default: 'PCS' },
      packingUnit: { type: String, default: 'Box' },
      costPrice: { type: Number, default: 0 },
      salePrice: { type: Number, default: 0 },
      reorderLevel: { type: Number, default: 10 },
      stock: { type: Number, default: 0 },
      description: { type: String, default: '' },
      active: { type: Boolean, default: true },
      status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
    },
    { timestamps: true }
  )
);
