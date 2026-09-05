import React, { useState } from 'react';
import { Wrench, Lock, Mail, ShieldCheck, ArrowRight, Store, CheckCircle } from 'lucide-react';
import { StaffMember, StoreLocation } from '../types';
import { STAFF_MEMBERS, STORES } from '../data/mockData';

interface LoginViewProps {
  onLogin: (user: StaffMember, store: StoreLocation) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('pedro@orcatech.com');
  const [password, setPassword] = useState('••••••••');
  const [selectedStoreId, setSelectedStoreId] = useState(STORES[0].id);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Informe o e-mail');
      return;
    }
    const store = STORES.find((s) => s.id === selectedStoreId) || STORES[0];
    const existing = STAFF_MEMBERS.find((s) => s.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      onLogin(existing, store);
    } else {
      // Mock new user session
      onLogin(
        {
          id: 'st-custom',
          name: email.split('@')[0],
          email,
          role: 'Técnico',
          companyId: store.companyId || 'comp-1',
        },
        store
      );
    }
  };

  const handleQuickLogin = (staff: StaffMember) => {
    const store = STORES.find((s) => s.id === selectedStoreId) || STORES[0];
    onLogin(staff, store);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 py-8 relative">
      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-xs mb-3">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Orça<span className="text-blue-600">Tech</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Orçamentos ultra-rápidos para assistência técnica
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] text-blue-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Pesquisar → Escolher Serviço → Orçamento → WhatsApp
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Acesso do Atendimento</h2>
          <p className="text-xs text-slate-500 mb-5">
            Entre para iniciar a precificação de aparelhos
          </p>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleCustomLogin} className="space-y-4">
            {/* Store selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-blue-600" />
                Unidade / Loja
              </label>
              <select
                id="login-store-select"
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {STORES.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                E-mail do Funcionário
              </label>
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@orcatech.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Senha de Acesso
              </label>
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                required
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Acessar Painel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Logins */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
              Acesso Rápido para Demonstração:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="quick-login-pedro"
                type="button"
                onClick={() => handleQuickLogin(STAFF_MEMBERS[0])}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600">
                    Pedro Santos
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Técnico Principal</span>
              </button>

              <button
                id="quick-login-carlos"
                type="button"
                onClick={() => handleQuickLogin(STAFF_MEMBERS[3])}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600">
                    Carlos Eduardo
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Gerente de Loja</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security / Architecture Footer */}
        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Estrutura SaaS com autenticação e dados modulares</span>
        </div>
      </div>
    </div>
  );
};
