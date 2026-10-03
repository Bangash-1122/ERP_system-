import mongoose from 'mongoose';

export const AuditLog = mongoose.model(
  'AuditLog',
  new mongoose.Schema(
    {
      timestamp: { type: Date, default: Date.now },
      userName: { type: String, required: true },
      userEmail: { type: String, default: '' },
      role: { type: String, default: 'Manager' },
      module: { type: String, required: true },
      action: { type: String, required: true }, // CREATE, UPDATE, DELETE, APPROVE, POST, VOID
      entity: { type: String, required: true },
      entityId: { type: String, required: true },
      ipAddress: { type: String, default: '127.0.0.1' },
      details: { type: String, default: '' },
      oldData: { type: mongoose.Schema.Types.Mixed, default: null },
      newData: { type: mongoose.Schema.Types.Mixed, default: null },
      changedFields: [{ type: String }]
    },
    { timestamps: true }
  )
);
