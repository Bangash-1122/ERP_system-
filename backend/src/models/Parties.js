import mongoose from 'mongoose';

const partyBaseFields = {
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  companyName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  openingBalance: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  creditLimit: { type: Number, default: 0 },
  taxNumber: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
};

export const Customer = mongoose.model('Customer', new mongoose.Schema(partyBaseFields, { timestamps: true }));
export const Supplier = mongoose.model('Supplier', new mongoose.Schema(partyBaseFields, { timestamps: true }));
export const Transporter = mongoose.model('Transporter', new mongoose.Schema({
  ...partyBaseFields,
  vehicleCount: { type: Number, default: 0 },
  contactPerson: { type: String, default: '' }
}, { timestamps: true }));

export const Employee = mongoose.model('Employee', new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String, default: '' },
  department: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  salary: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Inactive', 'Terminated'], default: 'Active' }
}, { timestamps: true }));

export const Owner = mongoose.model('Owner', new mongoose.Schema({
  name: { type: String, required: true },
  sharePercentage: { type: Number, default: 100 },
  capitalInvested: { type: Number, default: 0 },
  drawings: { type: Number, default: 0 },
  phone: { type: String, default: '' },
  email: { type: String, default: '' }
}, { timestamps: true }));

export const Partnership = mongoose.model('Partnership', new mongoose.Schema({
  name: { type: String, required: true },
  partnerCount: { type: Number, default: 2 },
  agreementDate: { type: Date, default: Date.now },
  totalCapital: { type: Number, default: 0 },
  profitSharingRatio: { type: String, default: '50:50' },
  status: { type: String, enum: ['Active', 'Dissolved'], default: 'Active' }
}, { timestamps: true }));

export const Saraf = mongoose.model('Saraf', new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  contactPerson: { type: String, default: '' },
  phone: { type: String, default: '' },
  marketLocation: { type: String, default: '' },
  currentBalance: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' }
}, { timestamps: true }));
