import mongoose from 'mongoose';

// Chart of Accounts
export const Account = mongoose.model(
  'Account',
  new mongoose.Schema(
    {
      code: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      type: {
        type: String,
        enum: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'],
        required: true
      },
      category: { type: String, required: true }, // e.g. Cash, Bank, Receivables, Payables, Capital, Operations
      parentAccount: { type: String, default: null },
      currency: { type: String, default: 'USD' },
      balance: { type: Number, default: 0 },
      isSystem: { type: Boolean, default: false },
      status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
    },
    { timestamps: true }
  )
);

// Balanced Vouchers (Journal, Payment, Receipt, Expense)
const voucherEntrySchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  accountCode: { type: String, required: true },
  accountName: { type: String, required: true },
  description: { type: String, default: '' },
  debit: { type: Number, default: 0, min: 0 },
  credit: { type: Number, default: 0, min: 0 }
});

export const Voucher = mongoose.model(
  'Voucher',
  new mongoose.Schema(
    {
      voucherNo: { type: String, required: true, unique: true },
      voucherType: {
        type: String,
        enum: ['Journal', 'Payment', 'Receipt', 'Sales', 'Purchase', 'Contra'],
        required: true
      },
      date: { type: Date, default: Date.now },
      branch: { type: String, default: 'Main Branch' },
      description: { type: String, default: '' },
      referenceNo: { type: String, default: '' },
      entries: [voucherEntrySchema],
      totalDebit: { type: Number, required: true, default: 0 },
      totalCredit: { type: Number, required: true, default: 0 },
      isBalanced: { type: Boolean, default: true },
      status: {
        type: String,
        enum: ['Draft', 'Approved', 'Posted', 'Cancelled'],
        default: 'Draft'
      },
      createdBy: { type: String, default: 'Admin' }
    },
    { timestamps: true }
  )
);

// General Ledger Entries
export const LedgerEntry = mongoose.model(
  'LedgerEntry',
  new mongoose.Schema(
    {
      voucherNo: { type: String, required: true },
      voucherType: { type: String, required: true },
      date: { type: Date, default: Date.now },
      branch: { type: String, default: 'Main Branch' },
      accountCode: { type: String, required: true },
      accountName: { type: String, required: true },
      description: { type: String, default: '' },
      debit: { type: Number, default: 0 },
      credit: { type: Number, default: 0 },
      runningBalance: { type: Number, default: 0 },
      partyName: { type: String, default: '' }
    },
    { timestamps: true }
  )
);

// Expense Tracker
export const Expense = mongoose.model(
  'Expense',
  new mongoose.Schema(
    {
      expenseNo: { type: String, required: true, unique: true },
      date: { type: Date, default: Date.now },
      category: { type: String, required: true },
      accountName: { type: String, default: 'Operational Expense' },
      paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer', 'Cheque', 'Petty Cash'], default: 'Cash' },
      amount: { type: Number, required: true },
      paidTo: { type: String, default: '' },
      reference: { type: String, default: '' },
      branch: { type: String, default: 'Main Branch' },
      notes: { type: String, default: '' },
      status: { type: String, enum: ['Draft', 'Approved', 'Paid'], default: 'Paid' },
      createdBy: { type: String, default: 'Admin' }
    },
    { timestamps: true }
  )
);

// Payment & Receipt
export const Payment = mongoose.model(
  'Payment',
  new mongoose.Schema(
    {
      paymentNo: { type: String, required: true, unique: true },
      date: { type: Date, default: Date.now },
      partyType: { type: String, enum: ['Supplier', 'Transporter', 'Expense', 'Other'], default: 'Supplier' },
      partyName: { type: String, required: true },
      paymentMode: { type: String, enum: ['Cash', 'Bank Transfer', 'Cheque', 'Online'], default: 'Bank Transfer' },
      accountPaidFrom: { type: String, default: 'Main Bank Account' },
      amount: { type: Number, required: true },
      referenceNo: { type: String, default: '' },
      branch: { type: String, default: 'Main Branch' },
      notes: { type: String, default: '' },
      status: { type: String, enum: ['Draft', 'Completed', 'Cancelled'], default: 'Completed' },
      createdBy: { type: String, default: 'Admin' }
    },
    { timestamps: true }
  )
);

export const Receipt = mongoose.model(
  'Receipt',
  new mongoose.Schema(
    {
      receiptNo: { type: String, required: true, unique: true },
      date: { type: Date, default: Date.now },
      partyType: { type: String, enum: ['Customer', 'Owner', 'Other'], default: 'Customer' },
      partyName: { type: String, required: true },
      receiptMode: { type: String, enum: ['Cash', 'Bank Transfer', 'Cheque', 'POS'], default: 'Cash' },
      accountDepositedTo: { type: String, default: 'Main Cash Drawer' },
      amount: { type: Number, required: true },
      referenceNo: { type: String, default: '' },
      branch: { type: String, default: 'Main Branch' },
      notes: { type: String, default: '' },
      status: { type: String, enum: ['Draft', 'Completed', 'Cancelled'], default: 'Completed' },
      createdBy: { type: String, default: 'Admin' }
    },
    { timestamps: true }
  )
);
