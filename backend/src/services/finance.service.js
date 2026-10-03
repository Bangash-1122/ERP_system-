import { Payment, Receipt, Expense, Customer, Supplier } from '../models/index.js';
import { accountingService } from './accounting.service.js';

export const financeService = {
  // Payments
  async getPayments(query = {}) {
    return Payment.find(query).sort({ date: -1 });
  },
  async createPayment(data) {
    const count = await Payment.countDocuments();
    data.paymentNo = `PAY-${String(count + 1).padStart(5, '0')}`;
    const payment = await Payment.create(data);

    if (data.partyType === 'Supplier' && data.partyName) {
      await Supplier.findOneAndUpdate(
        { name: data.partyName },
        { $inc: { currentBalance: -data.amount } }
      );
    }

    // Auto accounting voucher
    await accountingService.createVoucher({
      voucherType: 'Payment',
      branch: data.branch || 'Main Branch',
      referenceNo: payment.paymentNo,
      description: `Payment to ${data.partyName} via ${data.paymentMode}`,
      entries: [
        {
          accountCode: '2100', // Accounts Payable
          accountName: 'Accounts Payable',
          debit: data.amount,
          credit: 0
        },
        {
          accountCode: '1020', // Bank / Cash
          accountName: data.accountPaidFrom || 'Main Bank Account',
          debit: 0,
          credit: data.amount
        }
      ],
      status: 'Posted',
      createdBy: data.createdBy
    });

    return payment;
  },

  // Receipts
  async getReceipts(query = {}) {
    return Receipt.find(query).sort({ date: -1 });
  },
  async createReceipt(data) {
    const count = await Receipt.countDocuments();
    data.receiptNo = `REC-${String(count + 1).padStart(5, '0')}`;
    const receipt = await Receipt.create(data);

    if (data.partyType === 'Customer' && data.partyName) {
      await Customer.findOneAndUpdate(
        { name: data.partyName },
        { $inc: { currentBalance: -data.amount } }
      );
    }

    // Auto accounting voucher
    await accountingService.createVoucher({
      voucherType: 'Receipt',
      branch: data.branch || 'Main Branch',
      referenceNo: receipt.receiptNo,
      description: `Receipt from ${data.partyName} via ${data.receiptMode}`,
      entries: [
        {
          accountCode: '1010', // Cash
          accountName: data.accountDepositedTo || 'Main Cash Drawer',
          debit: data.amount,
          credit: 0
        },
        {
          accountCode: '1100', // Accounts Receivable
          accountName: 'Accounts Receivable',
          debit: 0,
          credit: data.amount
        }
      ],
      status: 'Posted',
      createdBy: data.createdBy
    });

    return receipt;
  },

  // Expenses
  async getExpenses(query = {}) {
    return Expense.find(query).sort({ date: -1 });
  },
  async createExpense(data) {
    const count = await Expense.countDocuments();
    data.expenseNo = `EXP-${String(count + 1).padStart(5, '0')}`;
    const exp = await Expense.create(data);

    await accountingService.createVoucher({
      voucherType: 'Journal',
      branch: data.branch || 'Main Branch',
      referenceNo: exp.expenseNo,
      description: `Expense: ${data.category} - ${data.notes || ''}`,
      entries: [
        {
          accountCode: '5000', // General Expense
          accountName: data.category || 'General Expense',
          debit: data.amount,
          credit: 0
        },
        {
          accountCode: '1010', // Cash/Bank
          accountName: 'Cash / Bank',
          debit: 0,
          credit: data.amount
        }
      ],
      status: 'Posted',
      createdBy: data.createdBy
    });

    return exp;
  }
};
