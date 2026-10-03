import { User, Role } from '../models/index.js';
import bcrypt from 'bcryptjs';

export const userService = {
  // Users
  async getUsers() {
    return User.find().select('-passwordHash').sort({ createdAt: -1 });
  },

  async createUser(data) {
    const passwordHash = await bcrypt.hash(data.password || 'Password123!', 10);
    const user = await User.create({
      ...data,
      passwordHash
    });
    return User.findById(user._id).select('-passwordHash');
  },

  async updateUser(id, data) {
    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }
    return User.findByIdAndUpdate(id, data, { new: true }).select('-passwordHash');
  },

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  },

  // Roles
  async getRoles() {
    return Role.find().sort({ name: 1 });
  },

  async createRole(data) {
    return Role.create(data);
  },

  async updateRole(id, data) {
    return Role.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteRole(id) {
    return Role.findByIdAndDelete(id);
  }
};
