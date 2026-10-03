import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import {
  User,
  Role,
  Branch,
  Warehouse,
  Shop,
  Currency,
  Category,
  QuantityUnit,
  PackingUnit,
  Product,
  Customer,
  Supplier,
  Transporter,
  Employee,
  Account,
  StockBalance,
  StockMovement,
  Purchase,
  Sale,
  Voucher,
  LedgerEntry,
  Shipment,
  Vehicle,
  AuditLog
} from './models/index.js';

export async function seedDatabase() {
  await connectDB();
  console.log('Seeding Nexus ERP demo dataset...');

  // 1. Roles
  await Role.deleteMany({});
  const adminRole = await Role.create({
    name: 'Administrator',
    code: 'ADMIN',
    description: 'Full system access and configurations',
    permissions: {
      sales: { create: true, read: true, update: true, delete: true, approve: true, post: true },
      purchases: { create: true, read: true, update: true, delete: true, approve: true, post: true },
      inventory: { create: true, read: true, update: true, delete: true, approve: true, post: true },
      accounting: { create: true, read: true, update: true, delete: true, approve: true, post: true },
      users: { create: true, read: true, update: true, delete: true, approve: true, post: true }
    },
    isSystem: true
  });

  // 2. Users
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('admin123', 10);
  await User.create([
    {
      name: 'Alexander Wright',
      email: 'admin@nexus.com',
      passwordHash,
      role: 'Administrator',
      roles: ['Administrator'],
      permissions: ['*'],
      phone: '+1 (555) 019-2834',
      employeeId: 'EMP-001',
      branches: ['Main Branch', 'West Coast Branch'],
      warehouses: ['Main Warehouse', 'West Coast Depot'],
      active: true
    },
    {
      name: 'Sarah Jenkins',
      email: 'accountant@nexus.com',
      passwordHash,
      role: 'Accountant',
      roles: ['Accountant'],
      permissions: ['accounting:*', 'reports:*'],
      phone: '+1 (555) 019-4821',
      employeeId: 'EMP-002',
      branches: ['Main Branch'],
      warehouses: ['Main Warehouse'],
      active: true
    }
  ]);

  // 3. Branches & Warehouses
  await Branch.deleteMany({});
  await Branch.create([
    { code: 'BR-MAIN', name: 'Main Branch', city: 'New York', address: '100 Broadway Ave', phone: '+1 212-555-0100', isHeadOffice: true },
    { code: 'BR-WEST', name: 'West Coast Branch', city: 'Los Angeles', address: '742 Evergreen Terrace', phone: '+1 310-555-0200', isHeadOffice: false }
  ]);

  await Warehouse.deleteMany({});
  await Warehouse.create([
    { code: 'WH-MAIN', name: 'Main Warehouse', branch: 'Main Branch', location: 'Section A-1 to F-10', capacity: 25000, isPrimary: true },
    { code: 'WH-WEST', name: 'West Coast Depot', branch: 'West Coast Branch', location: 'Logistics Park Gate 4', capacity: 15000, isPrimary: false }
  ]);

  // 4. Currencies
  await Currency.deleteMany({});
  await Currency.create([
    { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0, isBase: true },
    { code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.92, isBase: false },
    { code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.79, isBase: false }
  ]);

  // 5. Products & Categories
  await Category.deleteMany({});
  await Category.create([
    { code: 'CAT-IND', name: 'Industrial Tools', description: 'Power equipment and heavy tools' },
    { code: 'CAT-RAW', name: 'Raw Materials', description: 'Metals, polymers, and raw stock' },
    { code: 'CAT-ELEC', name: 'Electronics & Sensors', description: 'Controllers, relays, and sensors' }
  ]);

  await QuantityUnit.deleteMany({});
  await QuantityUnit.create([
    { code: 'PCS', name: 'Pieces', symbol: 'pcs' },
    { code: 'KG', name: 'Kilograms', symbol: 'kg' },
    { code: 'BOX', name: 'Boxes', symbol: 'box' }
  ]);

  await PackingUnit.deleteMany({});
  await PackingUnit.create([
    { code: 'BOX-12', name: 'Carton of 12', baseQuantity: 12, quantityUnit: 'PCS' },
    { code: 'PLT-100', name: 'Pallet of 100', baseQuantity: 100, quantityUnit: 'PCS' }
  ]);

  await Product.deleteMany({});
  const products = await Product.create([
    {
      sku: 'SKU-DRL-001',
      barcode: '8901234567890',
      name: 'Titanium Rotary Drill 850W',
      category: 'Industrial Tools',
      unit: 'PCS',
      costPrice: 85,
      salePrice: 149.99,
      reorderLevel: 20,
      stock: 145,
      description: 'High-torque brushless industrial drilling unit'
    },
    {
      sku: 'SKU-HYD-002',
      barcode: '8901234567891',
      name: 'Hydraulic Pressure Valve 2.5"',
      category: 'Industrial Tools',
      unit: 'PCS',
      costPrice: 120,
      salePrice: 210.0,
      reorderLevel: 15,
      stock: 62,
      description: 'Forged stainless steel pressure regulator valve'
    },
    {
      sku: 'SKU-ALU-003',
      barcode: '8901234567892',
      name: 'Aerospace Grade Aluminum Rod 20mm',
      category: 'Raw Materials',
      unit: 'KG',
      costPrice: 14.5,
      salePrice: 28.0,
      reorderLevel: 100,
      stock: 480,
      description: '6061-T6 Aluminum structural extrusion rods'
    },
    {
      sku: 'SKU-SEN-004',
      barcode: '8901234567893',
      name: 'Optical Laser Distance Sensor Pro',
      category: 'Electronics & Sensors',
      unit: 'PCS',
      costPrice: 42,
      salePrice: 89.5,
      reorderLevel: 25,
      stock: 8,
      description: 'High precision 50m LiDAR distance measuring sensor'
    }
  ]);

  // 6. Stock Balances
  await StockBalance.deleteMany({});
  for (const p of products) {
    await StockBalance.create({
      productId: p._id,
      productSku: p.sku,
      productName: p.name,
      warehouseName: 'Main Warehouse',
      onHand: p.stock,
      available: p.stock,
      reserved: 0,
      damaged: 0
    });
  }

  // 7. Customers & Suppliers
  await Customer.deleteMany({});
  await Customer.create([
    {
      code: 'CUST-0001',
      name: 'Apex Manufacturing Corp',
      companyName: 'Apex Industrial Holdings Ltd',
      email: 'procurement@apexcorp.com',
      phone: '+1 (555) 234-5678',
      city: 'Chicago',
      address: '400 Michigan Ave',
      currentBalance: 12450.0,
      creditLimit: 50000.0,
      taxNumber: 'US-TAX-892147'
    },
    {
      code: 'CUST-0002',
      name: 'Starlight Tech Solutions',
      companyName: 'Starlight Automation Inc',
      email: 'billing@starlighttech.io',
      phone: '+1 (555) 876-5432',
      city: 'Austin',
      address: '1200 Tech Ridge Parkway',
      currentBalance: 8200.0,
      creditLimit: 30000.0,
      taxNumber: 'US-TAX-339182'
    }
  ]);

  await Supplier.deleteMany({});
  await Supplier.create([
    {
      code: 'SUP-0001',
      name: 'Global Heavy Industries Ltd',
      companyName: 'GHI Metals & Equipment',
      email: 'sales@globalheavy.com',
      phone: '+1 (555) 998-1122',
      city: 'Pittsburgh',
      address: '88 Industrial Boulevard',
      currentBalance: 14800.0,
      creditLimit: 100000.0,
      taxNumber: 'US-SUP-771239'
    }
  ]);

  // 8. Chart of Accounts
  await Account.deleteMany({});
  await Account.create([
    { code: '1010', name: 'Petty Cash / Cash Drawer', type: 'Asset', category: 'Cash', balance: 14500, isSystem: true },
    { code: '1020', name: 'Main Corporate Operating Bank', type: 'Asset', category: 'Bank', balance: 58200, isSystem: true },
    { code: '1100', name: 'Accounts Receivable (Trade)', type: 'Asset', category: 'Receivables', balance: 20650, isSystem: true },
    { code: '1200', name: 'Inventory Asset on Hand', type: 'Asset', category: 'Inventory', balance: 89000, isSystem: true },
    { code: '2100', name: 'Accounts Payable (Trade)', type: 'Liability', category: 'Payables', balance: 14800, isSystem: true },
    { code: '3000', name: 'Owner Invested Capital', type: 'Equity', category: 'Capital', balance: 100000, isSystem: true },
    { code: '4000', name: 'Sales Revenue', type: 'Revenue', category: 'Sales Income', balance: 145000, isSystem: true },
    { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'Expense', category: 'Procurement', balance: 82000, isSystem: true },
    { code: '5100', name: 'Operational & Administrative Expense', type: 'Expense', category: 'Operations', balance: 15550, isSystem: true }
  ]);

  // 9. Initial Audit Log
  await AuditLog.deleteMany({});
  await AuditLog.create({
    userName: 'Alexander Wright',
    userEmail: 'admin@nexus.com',
    role: 'Administrator',
    module: 'System',
    action: 'INIT',
    entity: 'SystemBootstrap',
    entityId: 'SYS-INIT-001',
    details: 'Initial database seeds & chart of accounts loaded successfully',
    ipAddress: '127.0.0.1'
  });

  console.log('✅ Nexus ERP database seeded successfully with complete enterprise data!');
}

if (process.argv.includes('--run')) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
