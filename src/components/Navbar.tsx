import React from 'react';
import { LayoutDashboard, PlusCircle, History, Settings, Zap } from 'lucide-react';

export type NavTab = 'dashboard' | 'new-quote' | 'history' | 'admin';

interface NavbarProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  pendingQuotesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  pendingQuotesCount = 0,
}) => {
  const tabs = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'new-quote' as NavTab,
      label: 'Novo Orçamento',
      icon: PlusCircle,
      highlight: true,
    },
    {
      id: 'history' as NavTab,
      label: 'Histórico',
      icon: History,
      badge: pendingQuotesCount > 0 ? pendingQuotesCount : undefined,
    },
    {
      id: 'admin' as NavTab,
      label: 'Administração',
      icon: Settings,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-3 py-1.5 shadow-md safe-area-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.highlight) {
            return (
              <button
                key={tab.id}
                id={`mobile-nav-tab-${tab.id}`}
                onClick={() => onChangeTab(tab.id)}
                className="flex flex-col items-center -mt-5 cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                  }`}
                >
                  <PlusCircle className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold mt-0.5 text-blue-600">Novo</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              id={`mobile-nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer relative ${
                isActive ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
