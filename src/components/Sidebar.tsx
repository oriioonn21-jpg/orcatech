import React from 'react';
import { LayoutDashboard, Plus, Clock, Settings, LogOut } from 'lucide-react';
import { StaffMember } from '../types';
import { NavTab } from './Navbar';

interface SidebarProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  currentUser: StaffMember | null;
  onLogout: () => void;
  pendingQuotesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onChangeTab,
  currentUser,
  onLogout,
  pendingQuotesCount = 0,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'new-quote' as NavTab,
      label: 'Novo Orçamento',
      icon: Plus,
    },
    {
      id: 'history' as NavTab,
      label: 'Histórico',
      icon: Clock,
      badge: pendingQuotesCount > 0 ? pendingQuotesCount : undefined,
    },
    {
      id: 'admin' as NavTab,
      label: 'Configurações',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white hidden md:flex flex-col shrink-0 h-full select-none">
      <div className="p-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
            O
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-slate-900">OrçaTech</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-700 rounded border border-blue-200/60 uppercase">
              SaaS
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer matching Clean Minimalism */}
      {currentUser && (
        <div className="mt-auto p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                {currentUser.role}
              </span>
            </div>
          </div>
          <button
            id="sidebar-logout-btn"
            onClick={onLogout}
            title="Sair"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
