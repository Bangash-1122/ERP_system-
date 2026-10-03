import { Purchase, PurchaseReturn, Supplier } from '../models/index.js';
import { inventoryService } from './inventory.service.js';
import { accountingService } from './accounting.service.js';

export const purchaseService = {
  async getPurchases(filter = {}) {
    const query = {};
    if (filter.status && filter.status !== 'All') query.status = filter.status;
    if (filter.branch && filter.branch !== 'All') query.branch = filter.branch;
    if (filter.search) {
      query.$or = [
        { purchaseNo: { $regex: filter.search, $options: 'i' } },
        { supplierName: { $regex: filter.search, $options: 'i' } }
      ];
    }
    return Purchase.find(query).sort({ date: -1 });
  },

  async getPurchaseById(id) {
    return Purchase.findById(id);
  },

  async createPurchase(data) {
    const count = await Purchase.countDocuments();
    data.purchaseNo = `PUR-${String(count + 1).padStart(5, '0')}`;
    
    // Calculate totals
    let subtotal = 0;
    data.items.forEach(item => {
      const itemTotal = (item.quantity * item.unitPrice) - (item.discount || 0) + (item.tax || 0);
      item.total = itemTotal;
      subtotal += itemTotal;
    });

    data.subtotal = subtotal;
    data.grandTotal = subtotal - (data.discount || 0) + (data.tax || 0);
    data.balanceAmount = data.grandTotal - (data.paidAmount || 0);

    const purchase = await Purchase.create(data);

    if (data.status === 'Posted') {
      await this.postPurchase(purchase._id, data.createdBy);
    }

    return purchase;
  },

  async updatePurchase(id, data) {
    return Purchase.findByIdAndUpdate(id, data, { new: true });
  },

  async postPurchase(id, user = 'Admin') {
    const purchase = await Purchase.findById(id);
    if (!purchase) throw new Error('Purchase order not found');

    purchase.status = 'Posted';
    await purchase.save();

    // 1. Stock In Movements
    for (const item of purchase.items) {
      await inventoryService.recordMovement({
        productId: item.productId,
        productSku: item.productSku,
        productName: item.productName,
        warehouseName: purchase.warehouse,
        movementType: 'Purchase',
        referenceNo: purchase.purchaseNo,
        qtyIn: item.quantity,
        unitCost: item.unitPrice,
        notes: `Purchase from ${purchase.supplierName}`,
        createdBy: user
      });
    }

    // 2. Update Supplier Balance
    if (purchase.supplierName) {
      await Supplier.findOneAndUpdate(
        { name: purchase.supplierName },
        { $inc: { currentBalance: purchase.balanceAmount } }
      );
    }

    // 3. Post Accounting Voucher
    await accountingService.createVoucher({
      voucherType: 'Purchase',
      branch: purchase.branch,
      referenceNo: purchase.purchaseNo,
      description: `Purchase from ${purchase.supplierName} - Ref: ${purchase.purchaseNo}`,
      entries: [
        {
          accountCode: '1200', // Inventory Asset
          accountName: 'Inventory Asset',
          debit: purchase.grandTotal,
          credit: 0
        },
        {
          accountCode: '2100', // Accounts Payable
          accountName: 'Accounts Payable',
          debit: 0,
          credit: purchase.grandTotal
        }
      ],
      status: 'Posted',
      createdBy: user
    });

    return purchase;
  },

  // Returns
  async getReturns() {
    return PurchaseReturn.find().sort({ date: -1 });
  },

  async createReturn(data) {
    const count = await PurchaseReturn.countDocuments();
    data.returnNo = `PRET-${String(count + 1).padStart(5, '0')}`;
    const ret = await PurchaseReturn.create(data);

    if (data.status === 'Approved') {
      for (const item of data.items) {
        await inventoryService.recordMovement({
          productId: item.productId,
          productSku: item.productSku,
          productName: item.productName,
          warehouseName: data.warehouse,
          movementType: 'Return',
          referenceNo: ret.returnNo,
          qtyOut: item.quantity,
          unitCost: item.unitPrice,
          notes: `Purchase Return to ${data.supplierName}: ${data.reason}`,
          createdBy: data.createdBy
        });
      }
    }

    return ret;
  }
};
