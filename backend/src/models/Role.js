import mongoose from 'mongoose';

export const Role = mongoose.model(
  'Role',
  new mongoose.Schema(
    {
      name: { type: String, required: true, unique: true },
      code: { type: String, required: true, unique: true, uppercase: true },
      description: { type: String, default: '' },
      permissions: {
        type: Map,
        of: {
          create: { type: Boolean, default: false },
          read: { type: Boolean, default: true },
          update: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
          approve: { type: Boolean, default: false },
          post: { type: Boolean, default: false }
        },
        default: {}
      },
      isSystem: { type: Boolean, default: false }
    },
    { timestamps: true }
  )
);
