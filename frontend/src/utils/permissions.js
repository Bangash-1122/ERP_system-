export function hasPermission(user, module, action = 'read') {
  if (!user) return false;
  if (user.role === 'Administrator' || user.permissions?.includes('*')) return true;
  
  // Specific permission check
  const permKey = `${module}:${action}`;
  if (user.permissions?.includes(permKey)) return true;
  if (user.permissions?.includes(`${module}:*`)) return true;

  return false;
}

export const MODULE_NAMES = {
  SALES: 'sales',
  PURCHASES: 'purchases',
  INVENTORY: 'inventory',
  ACCOUNTING: 'accounting',
  PARTIES: 'parties',
  LOGISTICS: 'logistics',
  REPORTS: 'reports',
  USERS: 'users',
  AUDIT: 'audit'
};
