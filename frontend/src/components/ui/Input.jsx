import React from 'react';
import clsx from 'clsx';

export const Input = React.forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    className = '',
    containerClassName = '',
    required = false,
    ...props
  },
  ref
) {
  return (
    <div className={clsx('w-full flex flex-col gap-1', containerClassName)}>
      {label && (
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all',
            Icon ? 'pl-9' : 'pl-3',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
});

export const Select = React.forwardRef(function Select(
  {
    label,
    options = [],
    error,
    helperText,
    className = '',
    containerClassName = '',
    required = false,
    ...props
  },
  ref
) {
  return (
    <div className={clsx('w-full flex flex-col gap-1', containerClassName)}>
      {label && (
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          'w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all cursor-pointer',
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
});

export const Textarea = React.forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    className = '',
    containerClassName = '',
    required = false,
    rows = 3,
    ...props
  },
  ref
) {
  return (
    <div className={clsx('w-full flex flex-col gap-1', containerClassName)}>
      {label && (
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          'w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all',
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
});

export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-0.5 font-semibold'
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-sky-50 text-sky-700 border border-sky-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200'
  };

  // Map common ERP statuses automatically
  let finalVariant = variant;
  const lower = String(children).toLowerCase();
  if (lower === 'active' || lower === 'posted' || lower === 'paid' || lower === 'delivered' || lower === 'received' || lower === 'completed') {
    finalVariant = 'success';
  } else if (lower === 'draft' || lower === 'pending' || lower === 'in transit' || lower === 'partially paid' || lower === 'reported') {
    finalVariant = 'warning';
  } else if (lower === 'cancelled' || lower === 'inactive' || lower === 'unpaid' || lower === 'failed' || lower === 'terminated') {
    finalVariant = 'danger';
  } else if (lower === 'approved' || lower === 'shipped') {
    finalVariant = 'primary';
  }

  return (
    <span className={clsx('inline-flex items-center rounded-full', sizeStyles[size], variantStyles[finalVariant], className)}>
      {children}
    </span>
  );
}
