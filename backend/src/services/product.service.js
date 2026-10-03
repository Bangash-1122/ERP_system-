import { Product, Category, QuantityUnit, PackingUnit, StockBalance } from '../models/index.js';

export const productService = {
  // Products
  async getProducts(filter = {}) {
    const query = {};
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { sku: { $regex: filter.search, $options: 'i' } },
        { barcode: { $regex: filter.search, $options: 'i' } }
      ];
    }
    if (filter.category && filter.category !== 'All') query.category = filter.category;
    if (filter.status && filter.status !== 'All') query.status = filter.status;
    return Product.find(query).sort({ createdAt: -1 });
  },

  async getProductById(id) {
    return Product.findById(id);
  },

  async createProduct(data) {
    const product = await Product.create(data);
    // Initialize default stock balance entry
    await StockBalance.create({
      productId: product._id,
      productSku: product.sku,
      productName: product.name,
      warehouseName: 'Main Warehouse',
      onHand: data.stock || 0,
      available: data.stock || 0
    });
    return product;
  },

  async updateProduct(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteProduct(id) {
    return Product.findByIdAndDelete(id);
  },

  // Categories
  async getCategories() {
    return Category.find().sort({ name: 1 });
  },
  async createCategory(data) {
    return Category.create(data);
  },
  async updateCategory(id, data) {
    return Category.findByIdAndUpdate(id, data, { new: true });
  },
  async deleteCategory(id) {
    return Category.findByIdAndDelete(id);
  },

  // Quantity Units
  async getUnits() {
    return QuantityUnit.find().sort({ name: 1 });
  },
  async createUnit(data) {
    return QuantityUnit.create(data);
  },
  async deleteUnit(id) {
    return QuantityUnit.findByIdAndDelete(id);
  },

  // Packing Units
  async getPackingUnits() {
    return PackingUnit.find().sort({ name: 1 });
  },
  async createPackingUnit(data) {
    return PackingUnit.create(data);
  },
  async deletePackingUnit(id) {
    return PackingUnit.findByIdAndDelete(id);
  }
};
