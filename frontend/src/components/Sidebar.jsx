import { useState } from 'react'
import {
  BarChart3, BookOpen, BriefcaseBusiness, ChevronDown, CircleDollarSign, ClipboardList,
  FileText, LayoutDashboard, Package, Receipt, Settings2, ShieldCheck, ShoppingCart,
  Truck, Users, Warehouse, Boxes, WalletCards, UserRoundCog
} from 'lucide-react'

const groups = [
  { label: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Business', items: [
    { id: 'sales', label: 'Sales', icon: ShoppingCart, count: '24' },
    { id: 'purchases', label: 'Purchases', icon: ClipboardList },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'expenses', label: 'Expenses', icon: WalletCards },
  ]},
  { label: 'Finance', items: [
    { id: 'accounting', label: 'Accounting', icon: CircleDollarSign },
    { id: 'payments', label: 'Payments', icon: Receipt },
    { id: 'vouchers', label: 'Vouchers', icon: FileText },
  ]},
  { label: 'Directory', items: [
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'suppliers', label: 'Suppliers', icon: BriefcaseBusiness },
    { id: 'employees', label: 'Employees', icon: UserRoundCog },
  ]},
  { label: 'Workspace', items: [
    { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
    { id: 'reports', label: 'Report Center', icon: BarChart3 },
    { id: 'administration', label: 'Administration', icon: ShieldCheck },
    { id: 'settings', label: 'System Settings', icon: Settings2 },
  ]},
]

export default function Sidebar({ isOpen, currentSection, onNavigate }) {
  const [expanded, setExpanded] = useState({ Business: true, Finance: true, Directory: true, Workspace: true })

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <nav aria-label="Primary navigation">
        {groups.map(group => (
          <div className="nav-group" key={group.label}>
            {isOpen && <button className="nav-group-label" onClick={() => setExpanded(prev => ({ ...prev, [group.label]: !prev[group.label] }))}>
              <span>{group.label}</span>{group.label !== 'Overview' && <ChevronDown className={expanded[group.label] ? '' : 'chevron-closed'} data-icon="inline-end" />}
            </button>}
            {(group.label === 'Overview' || expanded[group.label] || !isOpen) && group.items.map(item => {
              const Icon = item.icon
              return <button key={item.id} className={`nav-item ${currentSection === item.id ? 'nav-item-active' : ''}`} onClick={() => onNavigate(item.id)} title={!isOpen ? item.label : undefined}>
                <Icon data-icon="inline-start" /><span className="nav-item-text">{item.label}</span>{item.count && isOpen && <span className="nav-count">{item.count}</span>}
              </button>
            })}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="workspace-card">
          <div className="workspace-icon"><Boxes data-icon="inline-start" /></div>
          {isOpen && <div><strong>Central Warehouse</strong><span>Inventory workspace</span></div>}
          {isOpen && <ChevronDown data-icon="inline-end" />}
        </div>
        {isOpen && <div className="sidebar-meta"><span className="online-dot" /> All systems operational</div>}
      </div>
    </aside>
  )
}
