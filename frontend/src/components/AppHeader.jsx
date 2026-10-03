import { Bell, ChevronDown, Menu, Search, Settings, User } from 'lucide-react'

export default function AppHeader({ onToggleSidebar }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <button className="icon-button menu-button" onClick={onToggleSidebar} aria-label="Toggle navigation">
          <Menu data-icon="inline-start" />
        </button>
        <div className="brand-lockup">
          <div className="brand-mark">N</div>
          <div>
            <div className="brand-name">NEXUS</div>
            <div className="brand-subtitle">Enterprise Suite</div>
          </div>
        </div>
      </div>

      <div className="header-search">
        <Search className="search-icon" aria-hidden="true" />
        <input aria-label="Search across ERP" placeholder="Search products, sales, customers..." />
        <kbd>⌘ K</kbd>
      </div>

      <div className="header-actions">
        <button className="branch-selector" aria-label="Select branch">
          <span className="status-dot" />
          <span className="branch-copy"><small>Active branch</small><strong>Main Branch</strong></span>
          <ChevronDown data-icon="inline-end" />
        </button>
        <button className="icon-button notification-button" aria-label="Notifications">
          <Bell data-icon="inline-start" />
          <span className="notification-dot" />
        </button>
        <button className="profile-button" aria-label="Open user menu">
          <span className="avatar">AM</span>
          <span className="profile-copy"><strong>Alex Morgan</strong><small>Administrator</small></span>
          <ChevronDown data-icon="inline-end" />
        </button>
        <button className="icon-button settings-button" aria-label="Settings"><Settings data-icon="inline-start" /></button>
      </div>
    </header>
  )
}
