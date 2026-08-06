import React, { useState } from 'react';
import { 
  Activity, 
  Bell, 
  Search, 
  ShieldAlert, 
  PlusCircle, 
  LayoutDashboard, 
  Wrench, 
  BarChart2, 
  Layers, 
  AlertTriangle,
  RefreshCw,
  Sliders,
  Sparkles,
  FileSpreadsheet,
  Settings,
  LogOut,
  User as UserIcon,
  Menu,
  X
} from 'lucide-react';
import { AppNotification, User } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'equipment' | 'failures' | 'pareto' | 'pm' | 'notifications' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'equipment' | 'failures' | 'pareto' | 'pm' | 'notifications' | 'settings') => void;
  notifications: AppNotification[];
  unreadCount: number;
  onOpenReportFailure: () => void;
  onOpenAddEquipment: () => void;
  onOpenImportExport: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onRefresh: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  notifications,
  unreadCount,
  onOpenReportFailure,
  onOpenAddEquipment,
  onOpenImportExport,
  onToggleCopilot,
  isCopilotOpen,
  searchQuery,
  setSearchQuery,
  onRefresh,
  currentUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-wide text-white font-mono">OCP</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">
                  SMART MAINTENANCE
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden lg:block">Office Chérifien des Phosphates • Reliability Platform</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search asset, tag (CV-204, P-101)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Actions Right */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Excel Import/Export Button */}
            <button
              onClick={onOpenImportExport}
              className="hidden sm:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Import or Export Excel / CSV Data"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden lg:inline">Excel / CSV</span>
            </button>

            {/* Report Failure Quick Button */}
            <button
              onClick={onOpenReportFailure}
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
              title="Report New Equipment Failure"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Report Breakdown</span>
            </button>

            {/* AI Copilot Button */}
            <button
              onClick={onToggleCopilot}
              className={`flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                isCopilotOpen
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Profile & Role Indicator */}
            {currentUser && (
              <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-300 font-bold font-mono text-xs flex items-center justify-center border border-emerald-500/30">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-[11px]">
                  <span className="font-bold text-white block truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-slate-400 font-mono capitalize">{currentUser.role.replace('_', ' ')}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Primary Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 border-t border-slate-800/80 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Executive Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'equipment'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Asset Directory & Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('failures')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'failures'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Failure Log & Work Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('pareto')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'pareto'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Pareto Analytics (80/20)</span>
          </button>

          <button
            onClick={() => setActiveTab('pm')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'pm'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>PM Schedules & Checklists</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Notifications ({unreadCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-2 bg-slate-950 px-2 rounded-b-xl">
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Executive Dashboard</span>
            </button>
            <button
              onClick={() => { setActiveTab('equipment'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Asset Directory & Telemetry</span>
            </button>
            <button
              onClick={() => { setActiveTab('failures'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
            >
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span>Failure Log & Work Orders</span>
            </button>
            <button
              onClick={() => { setActiveTab('pareto'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
            >
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span>Pareto Analytics (80/20)</span>
            </button>
            <button
              onClick={() => { setActiveTab('pm'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>PM Schedules</span>
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Settings & Site Config</span>
            </button>
            
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-3 text-xs text-slate-400">
              <span>User: {currentUser?.name || 'Operator'}</span>
              <button onClick={onLogout} className="text-rose-400 font-bold underline">Sign Out</button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
