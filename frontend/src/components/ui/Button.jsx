import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary', // primary | secondary | outline | danger | success | ghost
  size = 'md', // sm | md | lg
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-4 py-2.5 gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500 shadow-sm',
    secondary: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-700 shadow-sm',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus:ring-sky-500 shadow-xs',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-sm',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-400'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
}
