export const initialMockState = {
  branches: [
    { _id: 'br-1', code: 'BR-MAIN', name: 'Main Branch', city: 'New York', address: '100 Broadway Ave', phone: '+1 212-555-0100', isHeadOffice: true, status: 'Active' },
    { _id: 'br-2', code: 'BR-WEST', name: 'West Coast Branch', city: 'Los Angeles', address: '742 Evergreen Terrace', phone: '+1 310-555-0200', isHeadOffice: false, status: 'Active' }
  ],
  warehouses: [
    { _id: 'wh-1', code: 'WH-MAIN', name: 'Main Warehouse', branch: 'Main Branch', location: 'Zone A (Racks 1-15)', capacity: 25000, isPrimary: true, status: 'Active' },
    { _id: 'wh-2', code: 'WH-WEST', name: 'West Coast Depot', branch: 'West Coast Branch', location: 'Logistics Park Gate 4', capacity: 15000, isPrimary: false, status: 'Active' }
  ],
  shops: [
    { _id: 'sh-1', code: 'SH-01', name: 'Downtown Retail Outlet', branch: 'Main Branch', warehouse: 'Main Warehouse', phone: '+1 212-555-0199', status: 'Active' },
    { _id: 'sh-2', code: 'SH-02', name: 'Westfield Express Shop', branch: 'West Coast Branch', warehouse: 'West Coast Depot', phone: '+1 310-555-0288', status: 'Active' }
  ],
  currencies: [
    { _id: 'cur-1', code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0, isBase: true, status: 'Active' },
    { _id: 'cur-2', code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.92, isBase: false, status: 'Active' },
    { _id: 'cur-3', code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.79, isBase: false, status: 'Active' }
  ],
  categories: [
    { _id: 'cat-1', code: 'CAT-IND', name: 'Industrial Tools', description: 'Power equipment & heavy duty tools', status: 'Active' },
    { _id: 'cat-2', code: 'CAT-RAW', name: 'Raw Materials', description: 'Steel, aluminum, and polymers', status: 'Active' },
    { _id: 'cat-3', code: 'CAT-ELEC', name: 'Electronics & Sensors', description: 'Industrial automation components', status: 'Active' }
  ],
  units: [
    { _id: 'u-1', code: 'PCS', name: 'Pieces', symbol: 'pcs', status: 'Active' },
    { _id: 'u-2', code: 'KG', name: 'Kilograms', symbol: 'kg', status: 'Active' },
    { _id: 'u-3', code: 'BOX', name: 'Boxes', symbol: 'box', status: 'Active' },
    { _id: 'u-4', code: 'MTR', name: 'Meters', symbol: 'm', status: 'Active' }
  ],
  packingUnits: [
    { _id: 'pk-1', code: 'BOX-12', name: 'Carton of 12', baseQuantity: 12, quantityUnit: 'PCS', status: 'Active' },
    { _id: 'pk-2', code: 'PLT-100', name: 'Pallet of 100', baseQuantity: 100, quantityUnit: 'PCS', status: 'Active' }
  ],
  products: [
    {
      _id: 'p-1',
      sku: 'SKU-DRL-001',
      barcode: '8901234567890',
      name: 'Titanium Rotary Drill 850W',
      category: 'Industrial Tools',
      unit: 'PCS',
      packingUnit: 'Carton of 12',
      costPrice: 85.0,
      salePrice: 149.99,
      reorderLevel: 20,
      stock: 145,
      status: 'Active',
      description: 'Brushless industrial power drill with torque lock'
    },
    {
      _id: 'p-2',
      sku: 'SKU-HYD-002',
      barcode: '8901234567891',
      name: 'Hydraulic Pressure Valve 2.5"',
      category: 'Industrial Tools',
      unit: 'PCS',
      packingUnit: 'Carton of 12',
      costPrice: 120.0,
      salePrice: 210.0,
      reorderLevel: 15,
      stock: 62,
      status: 'Active',
      description: 'Forged 316-grade stainless steel fluid valve'
    },
    {
      _id: 'p-3',
      sku: 'SKU-ALU-003',
      barcode: '8901234567892',
      name: 'Aerospace Grade Aluminum Rod 20mm',
      category: 'Raw Materials',
      unit: 'KG',
      packingUnit: 'Pallet of 100',
      costPrice: 14.5,
      salePrice: 28.0,
      reorderLevel: 100,
      stock: 480,
      status: 'Active',
      description: '6061-T6 extruded structural aluminum round bars'
    },
    {
      _id: 'p-4',
      sku: 'SKU-SEN-004',
      barcode: '8901234567893',
      name: 'Optical Laser Distance Sensor Pro',
      category: 'Electronics & Sensors',
      unit: 'PCS',
      packingUnit: 'Carton of 12',
      costPrice: 42.0,
      salePrice: 89.5,
      reorderLevel: 25,
      stock: 8,
      status: 'Active',
      description: 'High frequency millimeter wave LiDAR distance sensor'
    }
  ],
  stockBalances: [
    { _id: 'sb-1', productSku: 'SKU-DRL-001', productName: 'Titanium Rotary Drill 850W', warehouseName: 'Main Warehouse', onHand: 145, reserved: 10, damaged: 2, available: 133, updatedAt: new Date().toISOString() },
    { _id: 'sb-2', productSku: 'SKU-HYD-002', productName: 'Hydraulic Pressure Valve 2.5"', warehouseName: 'Main Warehouse', onHand: 62, reserved: 5, damaged: 0, available: 57, updatedAt: new Date().toISOString() },
    { _id: 'sb-3', productSku: 'SKU-ALU-003', productName: 'Aerospace Grade Aluminum Rod 20mm', warehouseName: 'Main Warehouse', onHand: 480, reserved: 40, damaged: 0, available: 440, updatedAt: new Date().toISOString() },
    { _id: 'sb-4', productSku: 'SKU-SEN-004', productName: 'Optical Laser Distance Sensor Pro', warehouseName: 'Main Warehouse', onHand: 8, reserved: 0, damaged: 1, available: 7, updatedAt: new Date().toISOString() }
  ],
  movements: [
    { _id: 'mov-1', movementNo: 'MOV-00001', date: new Date().toISOString(), productSku: 'SKU-DRL-001', productName: 'Titanium Rotary Drill 850W', warehouseName: 'Main Warehouse', movementType: 'Purchase', referenceNo: 'PUR-00001', qtyIn: 50, qtyOut: 0, unitCost: 85, createdBy: 'Alexander Wright' },
    { _id: 'mov-2', movementNo: 'MOV-00002', date: new Date().toISOString(), productSku: 'SKU-HYD-002', productName: 'Hydraulic Pressure Valve 2.5"', warehouseName: 'Main Warehouse', movementType: 'Sale', referenceNo: 'INV-00001', qtyIn: 0, qtyOut: 8, unitCost: 120, createdBy: 'Alexander Wright' }
  ],
  transfers: [
    {
      _id: 'trf-1',
      transferNo: 'TRF-00001',
      transferDate: new Date().toISOString(),
      sourceWarehouse: 'Main Warehouse',
      destinationWarehouse: 'West Coast Depot',
      reference: 'REGIONAL-RESTOCK-01',
      status: 'In Transit',
      items: [{ productSku: 'SKU-DRL-001', productName: 'Titanium Rotary Drill 850W', availableStock: 145, transferQuantity: 20, unit: 'PCS' }],
      createdBy: 'Alexander Wright'
    }
  ],
  adjustments: [
    {
      _id: 'adj-1',
      adjustmentNo: 'ADJ-00001',
      date: new Date().toISOString(),
      warehouseName: 'Main Warehouse',
      reason: 'Physical inventory audit variance reconciliation',
      status: 'Posted',
      items: [{ productSku: 'SKU-ALU-003', productName: 'Aerospace Grade Aluminum Rod 20mm', currentStock: 475, adjustedStock: 480, difference: 5, unitCost: 14.5 }],
      createdBy: 'Alexander Wright'
    }
  ],
  damages: [
    {
      _id: 'dmg-1',
      damageNo: 'DAM-00001',
      date: new Date().toISOString(),
      warehouseName: 'Main Warehouse',
      reason: 'Forklift transit collision in Zone B',
      status: 'Disposed',
      items: [{ productSku: 'SKU-DRL-001', productName: 'Titanium Rotary Drill 850W', damagedQty: 2, unitCost: 85, totalLoss: 170 }],
      createdBy: 'Alexander Wright'
    }
  ],
  customers: [
    { _id: 'c-1', code: 'CUST-0001', name: 'Apex Manufacturing Corp', companyName: 'Apex Industrial Holdings', email: 'procurement@apexcorp.com', phone: '+1 (555) 234-5678', city: 'Chicago', address: '400 Michigan Ave', currentBalance: 12450.0, creditLimit: 50000.0, taxNumber: 'US-TAX-892147', status: 'Active' },
    { _id: 'c-2', code: 'CUST-0002', name: 'Starlight Tech Solutions', companyName: 'Starlight Automation Inc', email: 'billing@starlighttech.io', phone: '+1 (555) 876-5432', city: 'Austin', address: '1200 Tech Ridge Parkway', currentBalance: 8200.0, creditLimit: 30000.0, taxNumber: 'US-TAX-339182', status: 'Active' }
  ],
  suppliers: [
    { _id: 's-1', code: 'SUP-0001', name: 'Global Heavy Industries Ltd', companyName: 'GHI Metals & Equipment', email: 'sales@globalheavy.com', phone: '+1 (555) 998-1122', city: 'Pittsburgh', address: '88 Industrial Boulevard', currentBalance: 14800.0, creditLimit: 100000.0, taxNumber: 'US-SUP-771239', status: 'Active' },
    { _id: 's-2', code: 'SUP-0002', name: 'Vanguard Sensor Dynamics', companyName: 'VSD Electronics AG', email: 'orders@vanguardsensors.com', phone: '+1 (555) 443-8890', city: 'San Jose', address: '50 Silicon Valley Way', currentBalance: 3500.0, creditLimit: 40000.0, taxNumber: 'US-SUP-882910', status: 'Active' }
  ],
  transporters: [
    { _id: 't-1', code: 'TRN-0001', name: 'FastFreight Express Logistics', companyName: 'FastFreight Haulage LLC', contactPerson: 'David Miller', phone: '+1 (555) 334-1100', email: 'dispatch@fastfreight.com', city: 'Dallas', vehicleCount: 24, currentBalance: 1250, status: 'Active' }
  ],
  employees: [
    { _id: 'e-1', code: 'EMP-001', name: 'Alexander Wright', designation: 'Operations Director', department: 'Executive', phone: '+1 (555) 019-2834', email: 'admin@nexus.com', salary: 110000, status: 'Active' },
    { _id: 'e-2', code: 'EMP-002', name: 'Sarah Jenkins', designation: 'Chief Accountant', department: 'Finance', phone: '+1 (555) 019-4821', email: 'accountant@nexus.com', salary: 85000, status: 'Active' }
  ],
  owners: [
    { _id: 'o-1', name: 'Marcus Sterling', sharePercentage: 60, capitalInvested: 300000, drawings: 25000, phone: '+1 (555) 111-2222', email: 'marcus@sterlingholdings.com' },
    { _id: 'o-2', name: 'Elena Rostova', sharePercentage: 40, capitalInvested: 200000, drawings: 15000, phone: '+1 (555) 333-4444', email: 'elena@rostovacapital.com' }
  ],
  partnerships: [
    { _id: 'pt-1', name: 'Nexus Global Ventures JV', partnerCount: 2, agreementDate: '2024-01-15', totalCapital: 500000, profitSharingRatio: '60:40', status: 'Active' }
  ],
  saraf: [
    { _id: 'sr-1', code: 'SRF-001', name: 'Al-Madina Currency Exchange', contactPerson: 'Tariq Mansoor', phone: '+1 (555) 777-9911', marketLocation: 'Financial Trade District', currentBalance: 45000, currency: 'USD' }
  ],
  accounts: [
    { _id: 'acc-1', code: '1010', name: 'Petty Cash / Cash Drawer', type: 'Asset', category: 'Cash', balance: 14500, isSystem: true, status: 'Active' },
    { _id: 'acc-2', code: '1020', name: 'Main Corporate Operating Bank', type: 'Asset', category: 'Bank', balance: 58200, isSystem: true, status: 'Active' },
    { _id: 'acc-3', code: '1100', name: 'Accounts Receivable (Trade)', type: 'Asset', category: 'Receivables', balance: 20650, isSystem: true, status: 'Active' },
    { _id: 'acc-4', code: '1200', name: 'Inventory Asset on Hand', type: 'Asset', category: 'Inventory', balance: 89000, isSystem: true, status: 'Active' },
    { _id: 'acc-5', code: '2100', name: 'Accounts Payable (Trade)', type: 'Liability', category: 'Payables', balance: 14800, isSystem: true, status: 'Active' },
    { _id: 'acc-6', code: '3000', name: 'Owner Invested Capital', type: 'Equity', category: 'Capital', balance: 100000, isSystem: true, status: 'Active' },
    { _id: 'acc-7', code: '4000', name: 'Sales Revenue', type: 'Revenue', category: 'Sales Income', balance: 145000, isSystem: true, status: 'Active' },
    { _id: 'acc-8', code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'Expense', category: 'Procurement', balance: 82000, isSystem: true, status: 'Active' },
    { _id: 'acc-9', code: '5100', name: 'Operational & Administrative Expense', type: 'Expense', category: 'Operations', balance: 15550, isSystem: true, status: 'Active' }
  ],
  purchases: [
    {
      _id: 'pur-1',
      purchaseNo: 'PUR-00001',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      supplierName: 'Global Heavy Industries Ltd',
      branch: 'Main Branch',
      warehouse: 'Main Warehouse',
      currency: 'USD',
      items: [
        { productSku: 'SKU-DRL-001', productName: 'Titanium Rotary Drill 850W', quantity: 20, unit: 'PCS', packing: 'Box', unitPrice: 85, discount: 50, tax: 80, total: 1730 },
        { productSku: 'SKU-HYD-002', productName: 'Hydraulic Pressure Valve 2.5"', quantity: 10, unit: 'PCS', packing: 'Box', unitPrice: 120, discount: 0, tax: 60, total: 1260 }
      ],
      subtotal: 2990,
      discount: 50,
      tax: 140,
      grandTotal: 2990,
      paidAmount: 2000,
      balanceAmount: 990,
      status: 'Posted',
      paymentStatus: 'Partially Paid',
      createdBy: 'Alexander Wright'
    }
  ],
  purchaseReturns: [
    {
      _id: 'pret-1',
      returnNo: 'PRET-00001',
      originalPurchaseNo: 'PUR-00001',
      date: new Date().toISOString(),
      supplierName: 'Global Heavy Industries Ltd',
      branch: 'Main Branch',
      warehouse: 'Main Warehouse',
      items: [{ productSku: 'SKU-HYD-002', productName: 'Hydraulic Pressure Valve 2.5"', quantity: 1, unitPrice: 120, total: 120 }],
      totalRefund: 120,
      reason: 'Defective seal on packaging',
      status: 'Approved',
      createdBy: 'Alexander Wright'
    }
  ],
  sales: [
    {
      _id: 'sal-1',
      saleNo: 'INV-00001',
      date: new Date(Date.now() - 86400000).toISOString(),
      customerName: 'Apex Manufacturing Corp',
      branch: 'Main Branch',
      warehouse: 'Main Warehouse',
      currency: 'USD',
      items: [
        { productSku: 'SKU-DRL-001', productName: 'Titanium Rotary Drill 850W', quantity: 5, unit: 'PCS', packing: 'Box', unitPrice: 149.99, discount: 20, tax: 35, total: 764.95 },
        { productSku: 'SKU-ALU-003', productName: 'Aerospace Grade Aluminum Rod 20mm', quantity: 50, unit: 'KG', packing: 'Box', unitPrice: 28.0, discount: 0, tax: 70, total: 1470.0 }
      ],
      subtotal: 2234.95,
      discount: 20,
      tax: 105,
      grandTotal: 2234.95,
      receivedAmount: 1500,
      balanceAmount: 734.95,
      status: 'Posted',
      paymentStatus: 'Partially Paid',
      deliveryStatus: 'Delivered',
      createdBy: 'Alexander Wright'
    }
  ],
  saleReturns: [
    {
      _id: 'sret-1',
      returnNo: 'SRET-00001',
      originalSaleNo: 'INV-00001',
      date: new Date().toISOString(),
      customerName: 'Apex Manufacturing Corp',
      branch: 'Main Branch',
      warehouse: 'Main Warehouse',
      items: [{ productSku: 'SKU-DRL-001', productName: 'Titanium Rotary Drill 850W', quantity: 1, unitPrice: 149.99, total: 149.99 }],
      totalRefund: 149.99,
      reason: 'Customer ordered wrong chuck diameter',
      status: 'Approved',
      createdBy: 'Alexander Wright'
    }
  ],
  vouchers: [
    {
      _id: 'v-1',
      voucherNo: 'JV-00001',
      voucherType: 'Journal',
      date: new Date().toISOString(),
      branch: 'Main Branch',
      description: 'Monthly office rent & cloud server allocation',
      referenceNo: 'EXP-NOV-2025',
      totalDebit: 3500,
      totalCredit: 3500,
      isBalanced: true,
      status: 'Posted',
      entries: [
        { accountCode: '5100', accountName: 'Operational & Administrative Expense', description: 'Office lease & AWS hosting', debit: 3500, credit: 0 },
        { accountCode: '1020', accountName: 'Main Corporate Operating Bank', description: 'Wire transfer payment', debit: 0, credit: 3500 }
      ],
      createdBy: 'Sarah Jenkins'
    }
  ],
  ledgerEntries: [
    { _id: 'le-1', voucherNo: 'JV-00001', voucherType: 'Journal', date: new Date().toISOString(), branch: 'Main Branch', accountCode: '5100', accountName: 'Operational & Administrative Expense', description: 'Office lease & AWS hosting', debit: 3500, credit: 0, runningBalance: 15550 },
    { _id: 'le-2', voucherNo: 'JV-00001', voucherType: 'Journal', date: new Date().toISOString(), branch: 'Main Branch', accountCode: '1020', accountName: 'Main Corporate Operating Bank', description: 'Wire transfer payment', debit: 0, credit: 3500, runningBalance: 58200 }
  ],
  payments: [
    { _id: 'pay-1', paymentNo: 'PAY-00001', date: new Date().toISOString(), partyType: 'Supplier', partyName: 'Global Heavy Industries Ltd', paymentMode: 'Bank Transfer', accountPaidFrom: 'Main Corporate Operating Bank', amount: 2000, referenceNo: 'WIRE-99218', branch: 'Main Branch', notes: 'Advance for raw steel shipment', status: 'Completed', createdBy: 'Sarah Jenkins' }
  ],
  receipts: [
    { _id: 'rec-1', receiptNo: 'REC-00001', date: new Date().toISOString(), partyType: 'Customer', partyName: 'Apex Manufacturing Corp', receiptMode: 'Bank Transfer', accountDepositedTo: 'Main Corporate Operating Bank', amount: 1500, referenceNo: 'ACH-88320', branch: 'Main Branch', notes: 'Part payment for INV-00001', status: 'Completed', createdBy: 'Sarah Jenkins' }
  ],
  expenses: [
    { _id: 'exp-1', expenseNo: 'EXP-00001', date: new Date().toISOString(), category: 'Utilities & Power', accountName: 'Operational & Administrative Expense', paymentMethod: 'Bank Transfer', amount: 1250, paidTo: 'Consolidated Edison Co', reference: 'BILL-OCT-99', branch: 'Main Branch', status: 'Paid', createdBy: 'Sarah Jenkins' }
  ],
  shipments: [
    { _id: 'shp-1', shipmentNo: 'SHP-00001', orderNo: 'INV-00001', orderType: 'Sale', date: new Date().toISOString(), transporterName: 'FastFreight Express Logistics', vehicleNo: 'TRK-9821-NY', driverName: 'Robert Lang', driverPhone: '+1 555-443-2211', originWarehouse: 'Main Warehouse', destination: 'Apex Manufacturing Facility, Chicago', freightCost: 450, trackingNo: 'TRK-EXP-889921', status: 'Delivered', createdBy: 'Alexander Wright' }
  ],
  vehicles: [
    { _id: 'veh-1', vehicleNo: 'TRK-9821-NY', type: 'Truck', capacityTons: 15, driverName: 'Robert Lang', driverPhone: '+1 555-443-2211', transporter: 'FastFreight Express Logistics', status: 'Available' },
    { _id: 'veh-2', vehicleNo: 'VAN-4412-CA', type: 'Van', capacityTons: 3.5, driverName: 'Mark Stevens', driverPhone: '+1 555-889-1122', transporter: 'Internal Fleet', status: 'Available' }
  ],
  deliveries: [
    { _id: 'del-1', deliveryNo: 'DEL-00001', shipmentNo: 'SHP-00001', customerName: 'Apex Manufacturing Corp', deliveryAddress: '400 Michigan Ave, Chicago, IL', deliveryDate: new Date().toISOString(), receivedBy: 'Gary Simmons (Dock Mgr)', status: 'Delivered', remarks: 'Goods inspected and received in pristine condition' }
  ],
  users: [
    { _id: 'u-admin', name: 'Alexander Wright', email: 'admin@nexus.com', role: 'Administrator', roles: ['Administrator'], phone: '+1 (555) 019-2834', employeeId: 'EMP-001', branches: ['Main Branch', 'West Coast Branch'], warehouses: ['Main Warehouse', 'West Coast Depot'], active: true, lastLogin: new Date().toISOString() },
    { _id: 'u-acc', name: 'Sarah Jenkins', email: 'accountant@nexus.com', role: 'Accountant', roles: ['Accountant'], phone: '+1 (555) 019-4821', employeeId: 'EMP-002', branches: ['Main Branch'], warehouses: ['Main Warehouse'], active: true, lastLogin: new Date().toISOString() }
  ],
  roles: [
    {
      _id: 'r-1',
      name: 'Administrator',
      code: 'ADMIN',
      description: 'Superuser with unrestricted access across all ERP branches',
      permissions: {
        sales: { create: true, read: true, update: true, delete: true, approve: true, post: true },
        purchases: { create: true, read: true, update: true, delete: true, approve: true, post: true },
        inventory: { create: true, read: true, update: true, delete: true, approve: true, post: true },
        accounting: { create: true, read: true, update: true, delete: true, approve: true, post: true },
        logistics: { create: true, read: true, update: true, delete: true, approve: true, post: true },
        users: { create: true, read: true, update: true, delete: true, approve: true, post: true }
      },
      isSystem: true
    },
    {
      _id: 'r-2',
      name: 'Accountant',
      code: 'ACCT',
      description: 'Manages ledger, vouchers, financial reporting & cashflow',
      permissions: {
        sales: { create: false, read: true, update: false, delete: false, approve: false, post: false },
        purchases: { create: false, read: true, update: false, delete: false, approve: false, post: false },
        inventory: { create: false, read: true, update: false, delete: false, approve: false, post: false },
        accounting: { create: true, read: true, update: true, delete: false, approve: true, post: true },
        logistics: { create: false, read: true, update: false, delete: false, approve: false, post: false },
        users: { create: false, read: false, update: false, delete: false, approve: false, post: false }
      },
      isSystem: false
    }
  ],
  auditLogs: [
    {
      _id: 'aud-1',
      timestamp: new Date().toISOString(),
      userName: 'Alexander Wright',
      userEmail: 'admin@nexus.com',
      role: 'Administrator',
      module: 'Sales',
      action: 'POST',
      entity: 'SaleInvoice',
      entityId: 'INV-00001',
      details: 'Approved and posted sales invoice #INV-00001 for Apex Manufacturing Corp',
      ipAddress: '192.168.1.45',
      oldData: { status: 'Draft', balanceAmount: 2234.95 },
      newData: { status: 'Posted', receivedAmount: 1500, balanceAmount: 734.95 },
      changedFields: ['status', 'receivedAmount', 'balanceAmount']
    },
    {
      _id: 'aud-2',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      userName: 'Sarah Jenkins',
      userEmail: 'accountant@nexus.com',
      role: 'Accountant',
      module: 'Accounting',
      action: 'CREATE',
      entity: 'JournalVoucher',
      entityId: 'JV-00001',
      details: 'Created and posted balanced journal voucher for office rent allocation ($3,500)',
      ipAddress: '192.168.1.52',
      oldData: null,
      newData: { voucherNo: 'JV-00001', totalDebit: 3500, totalCredit: 3500, isBalanced: true },
      changedFields: ['voucherNo', 'totalDebit', 'totalCredit']
    }
  ]
};
