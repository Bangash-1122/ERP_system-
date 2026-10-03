import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models/index.js';
import { env } from '../config/env.js';

export const authService = {
  async register(data) {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) throw new Error('User with this email already exists');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role || 'Manager',
      roles: data.roles || ['Manager'],
      permissions: data.permissions || ['*'],
      branches: data.branches || ['Main Branch'],
      warehouses: data.warehouses || ['Main Warehouse']
    });
    return this.generateAuthResponse(user);
  },

  async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.active) throw new Error('Invalid email or account deactivated');
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new Error('Invalid email or password');
    user.lastLogin = new Date();
    await user.save();
    return this.generateAuthResponse(user);
  },

  generateAuthResponse(user) {
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roles: user.roles,
      permissions: user.permissions,
      branches: user.branches,
      warehouses: user.warehouses
    };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
    return { token, user: payload };
  }
};
