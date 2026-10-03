import { AuditLog } from '../models/index.js';

export const auditService = {
  async getLogs(filter = {}) {
    const query = {};
    if (filter.module && filter.module !== 'All') query.module = filter.module;
    if (filter.action && filter.action !== 'All') query.action = filter.action;
    if (filter.search) {
      query.$or = [
        { userName: { $regex: filter.search, $options: 'i' } },
        { entityId: { $regex: filter.search, $options: 'i' } },
        { details: { $regex: filter.search, $options: 'i' } }
      ];
    }
    return AuditLog.find(query).sort({ timestamp: -1 }).limit(100);
  },

  async logAction({
    userName = 'Admin User',
    userEmail = 'admin@nexus-erp.com',
    role = 'Administrator',
    module,
    action,
    entity,
    entityId,
    details = '',
    oldData = null,
    newData = null,
    ipAddress = '127.0.0.1'
  }) {
    let changedFields = [];
    if (oldData && newData) {
      Object.keys(newData).forEach(key => {
        if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
          changedFields.push(key);
        }
      });
    }

    return AuditLog.create({
      userName,
      userEmail,
      role,
      module,
      action,
      entity,
      entityId,
      details,
      oldData,
      newData,
      changedFields,
      ipAddress
    });
  }
};
