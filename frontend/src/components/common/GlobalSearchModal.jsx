import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Users, ShoppingCart, TrendingUp, FileText, Truck, ArrowRight, X } from 'lucide-react';
import { initialMockState } from '../../api/mockData.js';
import { useUiStore } from '../../store/uiStore.js';

export function GlobalSearchModal() {
  const { isGlobalSearchOpen, setGlobalSearchOpen } = useUiStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!isGlobalSearchOpen);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const term = searchTerm.toLowerCase().trim();

  const products = term ? initialMockState.products.filter(p => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term)) : [];
  const customers = term ? initialMockState.customers.filter(c => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term)) : [];
  const suppliers = term ? initialMockState.suppliers.filter(s => s.name.toLowerCase().includes(term) || s.code.toLowerCase().includes(term)) : [];
  const sales = term ? initialMockState.sales.filter(s => s.saleNo.toLowerCase().includes(term) || s.customerName.toLowerCase().includes(term)) : [];
  const purchases = term ? initialMockState.purchases.filter(p => p.purchaseNo.toLowerCase().includes(term) || p.supplierName.toLowerCase().includes(term)) : [];
  const vouchers = term ? initialMockState.vouchers.filter(v => v.voucherNo.toLowerCase().includes(term)) : [];

  const handleSelect = (path) => {
    setGlobalSearchOpen(false);
    setSearchTerm('');
    navigate(path);
  };

  const hasResults = products.length || customers.length || suppliers.length || sales.length || purchases.length || vouchers.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search products, customers, suppliers, sales, purchases, vouchers... (ESC to close)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          <button onClick={() => setGlobalSearchOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Box */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-slate-100">
          {!searchTerm ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Type keywords above to search across the entire ERP enterprise ecosystem.
            </div>
          ) : !hasResults ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching records found for "{searchTerm}".
            </div>
          ) : (
            <>
              {products.length > 0 && (
                <div className="py-2">
                  <div className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-1">Products</div>
                  {products.map(p => (
                    <div
                      key={p._id}
                      onClick={() => handleSelect('/products')}
                      className="px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-sky-600" />
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{p.name}</div>
                          <div className="text-[11px] text-slate-400">SKU: {p.sku} · Stock: {p.stock} {p.unit}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                  ))}
                </div>
              )}

              {customers.length > 0 && (
                <div className="py-2">
                  <div className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-1">Customers</div>
                  {customers.map(c => (
                    <div
                      key={c._id}
                      onClick={() => handleSelect('/parties/customers')}
                      className="px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{c.name}</div>
                          <div className="text-[11px] text-slate-400">{c.code} · Balance: ${c.currentBalance}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                  ))}
                </div>
              )}

              {sales.length > 0 && (
                <div className="py-2">
                  <div className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-1">Sales Invoices</div>
                  {sales.map(s => (
                    <div
                      key={s._id}
                      onClick={() => handleSelect('/sales')}
                      className="px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{s.saleNo} - {s.customerName}</div>
                          <div className="text-[11px] text-slate-400">Total: ${s.grandTotal} · Status: {s.status}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                  ))}
                </div>
              )}

              {purchases.length > 0 && (
                <div className="py-2">
                  <div className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-1">Purchases</div>
                  {purchases.map(p => (
                    <div
                      key={p._id}
                      onClick={() => handleSelect('/purchases')}
                      className="px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingCart className="w-4 h-4 text-amber-600" />
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{p.purchaseNo} - {p.supplierName}</div>
                          <div className="text-[11px] text-slate-400">Total: ${p.grandTotal} · Status: {p.status}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-slate-600">ESC</kbd> to exit</span>
          <span>Nexus ERP Search Engine</span>
        </div>
      </div>
    </div>
  );
}
