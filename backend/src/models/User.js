import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true, default: '' },
    employeeId: { type: String, trim: true, default: '' },
    role: { type: String, default: 'Manager' }, // Administrator, Manager, Accountant, SalesRep, InventoryClerk
    roles: [{ type: String }],
    branches: [{ type: String, default: 'Main Branch' }],
    warehouses: [{ type: String, default: 'Main Warehouse' }],
    permissions: [{ type: String }],
    active: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
