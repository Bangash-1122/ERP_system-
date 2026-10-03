import { Account, Voucher, LedgerEntry } from '../models/index.js';

export const accountingService = {
  // Chart of Accounts
  async getAccounts() {
    return Account.find().sort({ code: 1 });
  },

  async createAccount(data) {
    return Account.create(data);
  },

  async updateAccount(id, data) {
    return Account.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteAccount(id) {
    return Account.findByIdAndDelete(id);
  },

  // Vouchers
  async getVouchers(filter = {}) {
    const query = {};
    if (filter.voucherType && filter.voucherType !== 'All') query.voucherType = filter.voucherType;
    if (filter.search) {
      query.$or = [
        { voucherNo: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } }
      ];
    }
    return Voucher.find(query).sort({ date: -1 });
  },

  async createVoucher(data) {
    const count = await Voucher.countDocuments();
    const prefixMap = {
      Journal: 'JV',
      Payment: 'PV',
      Receipt: 'RV',
      Sales: 'SV',
      Purchase: 'PUV',
      Contra: 'CV'
    };
    const prefix = prefixMap[data.voucherType] || 'JV';
    data.voucherNo = `${prefix}-${String(count + 1).padStart(5, '0')}`;

    // Verify double entry equality
    let totalDebit = 0;
    let totalCredit = 0;
    data.entries.forEach(e => {
      totalDebit += Number(e.debit) || 0;
      totalCredit += Number(e.credit) || 0;
    });

    data.totalDebit = totalDebit;
    data.totalCredit = totalCredit;
    data.isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    const voucher = await Voucher.create(data);

    if (voucher.status === 'Posted' && voucher.isBalanced) {
      await this.postVoucherToLedger(voucher);
    }

    return voucher;
  },

  async postVoucherToLedger(voucher) {
    for (const entry of voucher.entries) {
      // Find latest running balance of account
      const lastEntry = await LedgerEntry.findOne({ accountCode: entry.accountCode }).sort({ createdAt: -1 });
      const previousBalance = lastEntry ? lastEntry.runningBalance : 0;
      
      // Determine balance delta: Debit increases Asset/Expense, Credit increases Liability/Equity/Revenue
      const account = await Account.findOne({ code: entry.accountCode });
      const isDebitNormal = account && ['Asset', 'Expense'].includes(account.type);
      const delta = isDebitNormal ? (entry.debit - entry.credit) : (entry.credit - entry.debit);
      const runningBalance = previousBalance + delta;

      await LedgerEntry.create({
        voucherNo: voucher.voucherNo,
        voucherType: voucher.voucherType,
        date: voucher.date,
        branch: voucher.branch,
        accountCode: entry.accountCode,
        accountName: entry.accountName,
        description: entry.description || voucher.description,
        debit: entry.debit,
        credit: entry.credit,
        runningBalance
      });

      // Update current account balance
      if (account) {
        account.balance = runningBalance;
        await account.save();
      }
    }
  },

  // General Ledger Query
  async getLedgerEntries(filter = {}) {
    const query = {};
    if (filter.accountCode && filter.accountCode !== 'All') query.accountCode = filter.accountCode;
    if (filter.branch && filter.branch !== 'All') query.branch = filter.branch;
    if (filter.startDate && filter.endDate) {
      query.date = { $gte: new Date(filter.startDate), $lte: new Date(filter.endDate) };
    }
    return LedgerEntry.find(query).sort({ date: 1, createdAt: 1 });
  }
};
