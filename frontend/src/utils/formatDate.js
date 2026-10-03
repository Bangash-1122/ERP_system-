import { format, isValid } from 'date-fns';

export function formatDate(date, pattern = 'dd MMM yyyy') {
  if (!date) return '-';
  const d = new Date(date);
  if (!isValid(d)) return '-';
  return format(d, pattern);
}

export function formatDateTime(date) {
  return formatDate(date, 'dd MMM yyyy, HH:mm');
}

export function formatISODate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (!isValid(d)) return '';
  return format(d, 'yyyy-MM-dd');
}
