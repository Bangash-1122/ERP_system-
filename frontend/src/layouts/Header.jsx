import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Building2,
  Warehouse,
  Bell,
  User,
  LogOut,
  Settings,
  ShieldCheck,
  ChevronDown,
  Globe,
  Maximize,
  Minimize,
  Download,
  Smartphone,
  CheckCircle2,
  X
} from 'lucide-react';
import { useUiStore } from '../store/uiStore.js';
import { useAuthStore } from '../store/authStore.js';
import { Breadcrumbs } from './Breadcrumbs.jsx';

export function Header() {
  const {
    sidebarOpen,
    toggleSidebar,
    selectedBranch,
    setSelectedBranch,
    selectedWarehouse,
    setSelectedWarehouse,
    selectedCurrency,
    setSelectedCurrency,
    setGlobalSearchOpen
  } = useUiStore();

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // PWA Install states
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // PWA Install event listener
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          await document.documentElement.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err.message);
    }
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallModal(true);
    }
  };

  const notifications = [
    { id: 1, title: 'Low Stock Alert', desc: 'Optical Laser Distance Sensor below 10 units', time: '10m ago', unread: true },
    { id: 2, title: 'Sale Invoice Posted', desc: 'INV-00001 for Apex Corp ($2,234.95)', time: '1h ago', unread: false },
    { id: 3, title: 'Warehouse Transfer', desc: 'TRF-00001 marked In Transit', time: '3h ago', unread: false }
  ];

  return (
    <>
      <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 lg:px-6 shadow-2xs">
        {/* Left section: Sidebar Toggle & Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block">
            <Breadcrumbs />
          </div>
        </div>

        {/* Center / Right Section */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Global Search Button */}
          <button
            onClick={() => setGlobalSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg text-xs transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search ERP...</span>
            <kbd className="hidden sm:inline px-1 py-0.2 bg-white border border-slate-200 rounded text-[10px] text-slate-500 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Branch Selector */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="Main Branch">Main Branch (NY)</option>
              <option value="West Coast Branch">West Coast (LA)</option>
            </select>
          </div>

          {/* Warehouse Selector */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <Warehouse className="w-3.5 h-3.5 text-amber-600" />
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="Main Warehouse">Main Warehouse</option>
              <option value="West Coast Depot">West Coast Depot</option>
            </select>
          </div>

          {/* Currency Selector */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          {/* Fullscreen Toggle Action Button */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isFullscreen
                ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 ring-1 ring-teal-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={isFullscreen ? 'Exit Full Screen' : 'Toggle Full Screen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Install App (PWA) Button */}
          <button
            onClick={handleInstallApp}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
              isAppInstalled
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                : 'bg-teal-600 hover:bg-teal-700 text-white border border-teal-700'
            }`}
            title="Install Nexus ERP App"
          >
            {isAppInstalled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">Installed</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
              </>
            )}
          </button>

          {/* Notifications Icon */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-40 animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
                  <span className="text-[10px] text-teal-600 font-semibold cursor-pointer">Mark all read</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">{user?.name || 'Alexander Wright'}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{user?.role || 'Super Admin'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 animate-in fade-in">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900">{user?.name || 'Alexander Wright'}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@nexus.com'}</div>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/users');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/roles');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Roles & Security</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/audit/activity');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Audit Logs</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* PWA / Mobile Install Instructions Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Install Nexus ERP</h3>
                <p className="text-xs text-slate-500">Run Nexus ERP as a standalone app on Mobile or Desktop</p>
              </div>
            </div>

            <div className="space-y-3 my-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                <span><strong>On Chrome/Edge (Desktop):</strong> Click the <strong>Install icon (⊕)</strong> on the right side of the address bar.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                <span><strong>On Android:</strong> Tap browser menu (⋮) and select <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                <span><strong>On iPhone / iPad (Safari):</strong> Tap the <strong>Share button (⎋)</strong>, scroll down and choose <strong>"Add to Home Screen"</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
