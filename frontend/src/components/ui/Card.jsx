import React from 'react';
import clsx from 'clsx';
import { X, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Button } from './Button.jsx';

export function Card({ children, title, subtitle, action, className = '', headerClassName = '', bodyClassName = '' }) {
  return (
    <div className={clsx('bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden', className)}>
      {(title || action) && (
        <div className={clsx('px-5 py-4 border-b border-slate-100 flex items-center justify-between', headerClassName)}>
          <div>
            {title && <h3 className="text-sm font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={clsx('p-5', bodyClassName)}>{children}</div>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl', footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className={clsx('bg-white w-full rounded-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]', maxWidth)}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ isOpen, onClose, title, children, width = 'max-w-md', footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className={clsx('bg-white h-full w-full border-l border-slate-200 shadow-2xl flex flex-col', width)}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex gap-4 items-start">
        <div className="p-2.5 rounded-full bg-rose-50 text-rose-600 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-600">{message}</p>
        </div>
      </div>
    </Modal>
  );
}

export function Skeleton({ className = '', lines = 1 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={clsx('h-4 bg-slate-200 rounded-md', className)} />
      ))}
    </div>
  );
}

export function EmptyState({
  title = 'No records found',
  description = 'There are no items matching your criteria. Get started by creating a new entry.',
  icon: Icon = Info,
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-slate-200 rounded-xl">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
