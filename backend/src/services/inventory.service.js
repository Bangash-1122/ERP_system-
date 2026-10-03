import { StockBalance, StockMovement, WarehouseTransfer, StockAdjustment, StockDamage, Product } from '../models/index.js';

export const inventoryService = {
  // Stock Balances
  async getStockBalances(filter = {}) {
    const query = {};
    if (filter.warehouse && filter.warehouse !== 'All') query.warehouseName = filter.warehouse;
    if (filter.search) {
      query.$or = [
        { productSku: { $regex: filter.search, $options: 'i' } },
        { productName: { $regex: filter.search, $options: 'i' } }
      ];
    }
    return StockBalance.find(query).sort({ updatedAt: -1 });
  },

  // Stock Movements
  async getStockMovements(filter = {}) {
    const query = {};
    if (filter.movementType && filter.movementType !== 'All') query.movementType = filter.movementType;
    if (filter.warehouse && filter.warehouse !== 'All') query.warehouseName = filter.warehouse;
    return StockMovement.find(query).sort({ date: -1 });
  },

  async recordMovement({
    productId,
    productSku,
    productName,
    warehouseName = 'Main Warehouse',
    movementType,
    referenceNo,
    qtyIn = 0,
    qtyOut = 0,
    unitCost = 0,
    createdBy = 'Admin',
    notes = ''
  }) {
    const count = await StockMovement.countDocuments();
    const movementNo = `MOV-${String(count + 1).padStart(5, '0')}`;

    const movement = await StockMovement.create({
      movementNo,
      date: new Date(),
      productId,
      productSku,
      productName,
      warehouseName,
      movementType,
      referenceNo,
      qtyIn,
      qtyOut,
      unitCost,
      createdBy,
      notes
    });

    // Update Stock Balance
    let balance = await StockBalance.findOne({ productSku, warehouseName });
    if (!balance) {
      balance = await StockBalance.create({
        productId,
        productSku,
        productName,
        warehouseName,
        onHand: 0,
        reserved: 0,
        damaged: 0,
        available: 0
      });
    }

    balance.onHand = Math.max(0, balance.onHand + qtyIn - qtyOut);
    balance.available = Math.max(0, balance.onHand - balance.reserved - balance.damaged);
    balance.lastMovementAt = new Date();
    await balance.save();

    // Sync product overall stock
    const allBalances = await StockBalance.find({ productSku });
    const totalStock = allBalances.reduce((sum, b) => sum + b.onHand, 0);
    await Product.findOneAndUpdate({ sku: productSku }, { stock: totalStock });

    return movement;
  },

  // Warehouse Transfers
  async getTransfers() {
    return WarehouseTransfer.find().sort({ transferDate: -1 });
  },

  async createTransfer(data) {
    const count = await WarehouseTransfer.countDocuments();
    data.transferNo = `TRF-${String(count + 1).padStart(5, '0')}`;
    return WarehouseTransfer.create(data);
  },

  async updateTransferStatus(id, status, user = 'Admin') {
    const transfer = await WarehouseTransfer.findById(id);
    if (!transfer) throw new Error('Transfer record not found');
    transfer.status = status;
    await transfer.save();

    if (status === 'Received') {
      // Execute movements
      for (const item of transfer.items) {
        // Out from source
        await this.recordMovement({
          productId: item.productId,
          productSku: item.productSku,
          productName: item.productName,
          warehouseName: transfer.sourceWarehouse,
          movementType: 'Transfer',
          referenceNo: transfer.transferNo,
          qtyOut: item.transferQuantity,
          notes: `Transfer to ${transfer.destinationWarehouse}`,
          createdBy: user
        });
        // In to destination
        await this.recordMovement({
          productId: item.productId,
          productSku: item.productSku,
          productName: item.productName,
          warehouseName: transfer.destinationWarehouse,
          movementType: 'Transfer',
          referenceNo: transfer.transferNo,
          qtyIn: item.transferQuantity,
          notes: `Transfer from ${transfer.sourceWarehouse}`,
          createdBy: user
        });
      }
    }

    return transfer;
  },

  // Adjustments
  async getAdjustments() {
    return StockAdjustment.find().sort({ date: -1 });
  },

  async createAdjustment(data) {
    const count = await StockAdjustment.countDocuments();
    data.adjustmentNo = `ADJ-${String(count + 1).padStart(5, '0')}`;
    const adj = await StockAdjustment.create(data);

    if (data.status === 'Posted') {
      for (const item of data.items) {
        if (item.difference > 0) {
          await this.recordMovement({
            productId: item.productId,
            productSku: item.productSku,
            productName: item.productName,
            warehouseName: data.warehouseName,
            movementType: 'Adjustment',
            referenceNo: adj.adjustmentNo,
            qtyIn: item.difference,
            unitCost: item.unitCost,
            notes: `Adjustment: ${data.reason}`,
            createdBy: data.createdBy
          });
        } else if (item.difference < 0) {
          await this.recordMovement({
            productId: item.productId,
            productSku: item.productSku,
            productName: item.productName,
            warehouseName: data.warehouseName,
            movementType: 'Adjustment',
            referenceNo: adj.adjustmentNo,
            qtyOut: Math.abs(item.difference),
            unitCost: item.unitCost,
            notes: `Adjustment: ${data.reason}`,
            createdBy: data.createdBy
          });
        }
      }
    }
    return adj;
  },

  // Damage Logs
  async getDamages() {
    return StockDamage.find().sort({ date: -1 });
  },

  async createDamage(data) {
    const count = await StockDamage.countDocuments();
    data.damageNo = `DAM-${String(count + 1).padStart(5, '0')}`;
    const dmg = await StockDamage.create(data);

    for (const item of data.items) {
      await this.recordMovement({
        productId: item.productId,
        productSku: item.productSku,
        productName: item.productName,
        warehouseName: data.warehouseName,
        movementType: 'Damage',
        referenceNo: dmg.damageNo,
        qtyOut: item.damagedQty,
        unitCost: item.unitCost,
        notes: `Damaged item: ${data.reason}`,
        createdBy: data.createdBy
      });
    }

    return dmg;
  }
};
