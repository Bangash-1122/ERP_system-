import React from 'react';
import clsx from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function KpiCard({
  title,
  value,
  subtitle,
  change,
  changeType = 'positive', // positive | negative | neutral
  icon: Icon,
  variant = 'default', // default | primary | success | warning | danger
  className = ''
}) {
  const iconBgStyles = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-sky-50 text-sky-600',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-rose-50 text-rose-600'
  };

  return (
    <div className={clsx('bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={clsx('p-2.5 rounded-lg shrink-0', iconBgStyles[variant])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          {change && (
            <div
              className={clsx(
                'flex items-center gap-1 font-medium',
                changeType === 'positive' && 'text-emerald-600',
                changeType === 'negative' && 'text-rose-600',
                changeType === 'neutral' && 'text-slate-500'
              )}
            >
              {changeType === 'positive' && <TrendingUp className="w-3.5 h-3.5" />}
              {changeType === 'negative' && <TrendingDown className="w-3.5 h-3.5" />}
              <span>{change}</span>
            </div>
          )}
          {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, breadcrumbs, actions, className = '' }) {
  return (
    <div className={clsx('mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4', className)}>
      <div>
        {breadcrumbs}
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
