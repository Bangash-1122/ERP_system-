import { Customer, Supplier, Transporter, Employee, Owner, Partnership, Saraf } from '../models/index.js';

export const partyService = {
  // Customers
  async getCustomers(query = {}) {
    return Customer.find(query).sort({ createdAt: -1 });
  },
  async createCustomer(data) {
    if (!data.code) {
      const count = await Customer.countDocuments();
      data.code = `CUST-${String(count + 1).padStart(4, '0')}`;
    }
    return Customer.create(data);
  },
  async updateCustomer(id, data) {
    return Customer.findByIdAndUpdate(id, data, { new: true });
  },
  async deleteCustomer(id) {
    return Customer.findByIdAndDelete(id);
  },

  // Suppliers
  async getSuppliers(query = {}) {
    return Supplier.find(query).sort({ createdAt: -1 });
  },
  async createSupplier(data) {
    if (!data.code) {
      const count = await Supplier.countDocuments();
      data.code = `SUP-${String(count + 1).padStart(4, '0')}`;
    }
    return Supplier.create(data);
  },
  async updateSupplier(id, data) {
    return Supplier.findByIdAndUpdate(id, data, { new: true });
  },
  async deleteSupplier(id) {
    return Supplier.findByIdAndDelete(id);
  },

  // Transporters
  async getTransporters(query = {}) {
    return Transporter.find(query).sort({ createdAt: -1 });
  },
  async createTransporter(data) {
    if (!data.code) {
      const count = await Transporter.countDocuments();
      data.code = `TRN-${String(count + 1).padStart(4, '0')}`;
    }
    return Transporter.create(data);
  },
  async updateTransporter(id, data) {
    return Transporter.findByIdAndUpdate(id, data, { new: true });
  },
  async deleteTransporter(id) {
    return Transporter.findByIdAndDelete(id);
  },

  // Employees
  async getEmployees(query = {}) {
    return Employee.find(query).sort({ createdAt: -1 });
  },
  async createEmployee(data) {
    if (!data.code) {
      const count = await Employee.countDocuments();
      data.code = `EMP-${String(count + 1).padStart(4, '0')}`;
    }
    return Employee.create(data);
  },
  async updateEmployee(id, data) {
    return Employee.findByIdAndUpdate(id, data, { new: true });
  },
  async deleteEmployee(id) {
    return Employee.findByIdAndDelete(id);
  },

  // Owners
  async getOwners() {
    return Owner.find().sort({ sharePercentage: -1 });
  },
  async createOwner(data) {
    return Owner.create(data);
  },
  async updateOwner(id, data) {
    return Owner.findByIdAndUpdate(id, data, { new: true });
  },
  async deleteOwner(id) {
    return Owner.findByIdAndDelete(id);
  },

  // Partnerships
  async getPartnerships() {
    return Partnership.find().sort({ createdAt: -1 });
  },
  async createPartnership(data) {
    return Partnership.create(data);
  },
  async updatePartnership(id, data) {
    return Partnership.findByIdAndUpdate(id, data, { new: true });
  },

  // Saraf
  async getSarafs() {
    return Saraf.find().sort({ name: 1 });
  },
  async createSaraf(data) {
    if (!data.code) {
      const count = await Saraf.countDocuments();
      data.code = `SRF-${String(count + 1).padStart(4, '0')}`;
    }
    return Saraf.create(data);
  },
  async updateSaraf(id, data) {
    return Saraf.findByIdAndUpdate(id, data, { new: true });
  }
};
