import React from 'react';
import { Store, Zap, LogOut } from 'lucide-react';
import { StaffMember, StoreLocation } from '../types';
import { NavTab } from './Navbar';

interface HeaderProps {
  currentUser: StaffMember | null;
  currentStore: StoreLocation;
  stores: StoreLocation[];
  onSelectStore: (store: StoreLocation) => void;
  onLogout: () => void;
  onNewQuoteClick: () => void;
  activeTab?: NavTab;
}

const TAB_TITLES: Record<NavTab, string> = {
  dashboard: 'Dashboard',
  'new-quote': 'Novo Orçamento',
  history: 'Histórico de Orçamentos',
  admin: 'Administração',
};

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentStore,
  stores,
  onSelectStore,
  onLogout,
  onNewQuoteClick,
  activeTab = 'dashboard',
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 z-20">
      {/* Title on desktop, Brand on mobile */}
      <div className="flex items-center gap-3">
        {/* Mobile-only logo */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            O
          </div>
          <span className="font-bold text-slate-900 text-base">OrçaTech</span>
        </div>

        {/* Desktop View Title */}
        <h1 className="hidden md:block text-lg font-semibold text-slate-900 tracking-tight">
          {TAB_TITLES[activeTab] || 'Novo Orçamento'}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick action button */}
        {activeTab !== 'new-quote' && (
          <button
            id="header-quick-new-quote-btn"
            onClick={onNewQuoteClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Novo Orçamento</span>
          </button>
        )}

        {/* Store / Unidade Indicator & Switcher */}
        <div className="flex items-center gap-1.5 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-400 hidden sm:inline">Unidade:</span>
          <select
            id="store-switcher-select"
            value={currentStore.id}
            onChange={(e) => {
              const found = stores.find((s) => s.id === e.target.value);
              if (found) onSelectStore(found);
            }}
            className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
          >
            {stores.map((store) => (
              <option key={store.id} value={store.id} className="bg-white text-slate-800">
                {store.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile user info / logout */}
        {currentUser && (
          <div className="md:hidden flex items-center gap-1.5 pl-1">
            <button
              id="header-logout-mobile-btn"
              onClick={onLogout}
              title="Sair"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

