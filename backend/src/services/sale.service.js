import { Sale, SaleReturn, Customer } from '../models/index.js';
import { inventoryService } from './inventory.service.js';
import { accountingService } from './accounting.service.js';

export const saleService = {
  async getSales(filter = {}) {
    const query = {};
    if (filter.status && filter.status !== 'All') query.status = filter.status;
    if (filter.branch && filter.branch !== 'All') query.branch = filter.branch;
    if (filter.search) {
      query.$or = [
        { saleNo: { $regex: filter.search, $options: 'i' } },
        { customerName: { $regex: filter.search, $options: 'i' } }
      ];
    }
    return Sale.find(query).sort({ date: -1 });
  },

  async getSaleById(id) {
    return Sale.findById(id);
  },

  async createSale(data) {
    const count = await Sale.countDocuments();
    data.saleNo = `INV-${String(count + 1).padStart(5, '0')}`;

    let subtotal = 0;
    data.items.forEach(item => {
      const itemTotal = (item.quantity * item.unitPrice) - (item.discount || 0) + (item.tax || 0);
      item.total = itemTotal;
      subtotal += itemTotal;
    });

    data.subtotal = subtotal;
    data.grandTotal = subtotal - (data.discount || 0) + (data.tax || 0);
    data.balanceAmount = data.grandTotal - (data.receivedAmount || 0);

    const sale = await Sale.create(data);

    if (data.status === 'Posted') {
      await this.postSale(sale._id, data.createdBy);
    }

    return sale;
  },

  async updateSale(id, data) {
    return Sale.findByIdAndUpdate(id, data, { new: true });
  },

  async postSale(id, user = 'Admin') {
    const sale = await Sale.findById(id);
    if (!sale) throw new Error('Sales invoice not found');

    sale.status = 'Posted';
    await sale.save();

    // 1. Stock Out Movements
    for (const item of sale.items) {
      await inventoryService.recordMovement({
        productId: item.productId,
        productSku: item.productSku,
        productName: item.productName,
        warehouseName: sale.warehouse,
        movementType: 'Sale',
        referenceNo: sale.saleNo,
        qtyOut: item.quantity,
        unitCost: item.unitPrice,
        notes: `Sale to ${sale.customerName}`,
        createdBy: user
      });
    }

    // 2. Update Customer Balance
    if (sale.customerName) {
      await Customer.findOneAndUpdate(
        { name: sale.customerName },
        { $inc: { currentBalance: sale.balanceAmount } }
      );
    }

    // 3. Accounting Voucher
    await accountingService.createVoucher({
      voucherType: 'Sales',
      branch: sale.branch,
      referenceNo: sale.saleNo,
      description: `Sales Invoice for ${sale.customerName} - Ref: ${sale.saleNo}`,
      entries: [
        {
          accountCode: '1100', // Accounts Receivable
          accountName: 'Accounts Receivable',
          debit: sale.grandTotal,
          credit: 0
        },
        {
          accountCode: '4000', // Sales Revenue
          accountName: 'Sales Revenue',
          debit: 0,
          credit: sale.grandTotal
        }
      ],
      status: 'Posted',
      createdBy: user
    });

    return sale;
  },

  // Returns
  async getReturns() {
    return SaleReturn.find().sort({ date: -1 });
  },

  async createReturn(data) {
    const count = await SaleReturn.countDocuments();
    data.returnNo = `SRET-${String(count + 1).padStart(5, '0')}`;
    const ret = await SaleReturn.create(data);

    if (data.status === 'Approved') {
      for (const item of data.items) {
        await inventoryService.recordMovement({
          productId: item.productId,
          productSku: item.productSku,
          productName: item.productName,
          warehouseName: data.warehouse,
          movementType: 'Return',
          referenceNo: ret.returnNo,
          qtyIn: item.quantity,
          unitCost: item.unitPrice,
          notes: `Sale Return from ${data.customerName}: ${data.reason}`,
          createdBy: data.createdBy
        });
      }
    }

    return ret;
  }
};
