import { Branch, Warehouse, Shop, Currency } from '../models/index.js';

export const orgService = {
  // Branches
  async getBranches(query = {}) {
    return Branch.find(query).sort({ createdAt: -1 });
  },
  async createBranch(data) {
    return Branch.create(data);
  },
  async updateBranch(id, data) {
    return Branch.findByIdAndUpdate(id, data, { new: true });
  },
  async deleteBranch(id) {
    return Branch.findByIdAndDelete(id);
  },

  // Warehouses
  async getWarehouses(query = {}) {
    return Warehouse.find(query).sort({ createdAt: -1 });
  },
  async createWarehouse(data) {
    return Warehouse.create(data);
  },
  async updateWarehouse(id, data) {
    return Warehouse.findByIdAndUpdate(id, data, { new: true });
  },
  async deleteWarehouse(id) {
    return Warehouse.findByIdAndDelete(id);
  },

  // Shops
  async getShops(query = {}) {
    return Shop.find(query).sort({ createdAt: -1 });
  },
  async createShop(data) {
    return Shop.create(data);
  },
  async updateShop(id, data) {
    return Shop.findByIdAndUpdate(id, data, { new: true });
  },
  async deleteShop(id) {
    return Shop.findByIdAndDelete(id);
  },

  // Currencies
  async getCurrencies(query = {}) {
    return Currency.find(query).sort({ isBase: -1, code: 1 });
  },
  async createCurrency(data) {
    if (data.isBase) {
      await Currency.updateMany({}, { isBase: false });
    }
    return Currency.create(data);
  },
  async updateCurrency(id, data) {
    if (data.isBase) {
      await Currency.updateMany({ _id: { $ne: id } }, { isBase: false });
    }
    return Currency.findByIdAndUpdate(id, data, { new: true });
  },
  async deleteCurrency(id) {
    return Currency.findByIdAndDelete(id);
  }
};
