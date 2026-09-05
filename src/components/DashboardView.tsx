import React from 'react';
import {
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  Send,
  Smartphone,
  ChevronRight,
  ArrowUpRight,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { Quote, StaffMember, StoreLocation, BrandName } from '../types';
import { BRANDS } from '../data/mockData';

interface DashboardViewProps {
  currentUser: StaffMember | null;
  currentStore: StoreLocation;
  quotes: Quote[];
  onStartNewQuote: (preSelectedBrand?: BrandName) => void;
  onViewQuote: (quote: Quote) => void;
  onNavigateHistory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  currentStore,
  quotes,
  onStartNewQuote,
  onViewQuote,
  onNavigateHistory,
}) => {
  // Quick metrics calculations
  const totalToday = quotes.length;
  const totalValue = quotes.reduce((acc, q) => acc + q.cashPrice, 0);
  const sentCount = quotes.filter((q) => q.status === 'Enviado' || q.status === 'Aprovado').length;
  const sentPercentage = totalToday > 0 ? Math.round((sentCount / totalToday) * 100) : 0;
  const approvedCount = quotes.filter((q) => q.status === 'Aprovado').length;

  const recentQuotes = quotes.slice(0, 5);

  return (
    <div className="space-y-5 pb-20 sm:pb-8">
      {/* Top Greeting & Fast Action Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5" />
                Sistema Ativo
              </span>
              <span className="text-xs text-slate-400">• {currentStore.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Olá, {currentUser?.name || 'Técnico'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
              Precifique reparos e gere a mensagem do WhatsApp para o cliente em segundos.
            </p>
          </div>

          {/* New Quote CTA */}
          <button
            id="dashboard-new-quote-primary-btn"
            onClick={() => onStartNewQuote()}
            className="w-full sm:w-auto px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer shrink-0"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span className="uppercase tracking-wider">Novo Orçamento</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Orçamentos Hoje */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Orçamentos</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Smartphone className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{totalToday}</span>
            <span className="text-xs text-slate-500 ml-1.5">hoje</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +4 vs ontem
          </p>
        </div>

        {/* Card 2: Valor Total Cotado */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Cotado</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">
              R$ {totalValue.toLocaleString('pt-BR')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Média de R$ {totalToday > 0 ? Math.round(totalValue / totalToday) : 0} por reparo
          </p>
        </div>

        {/* Card 3: Taxa de Envio WhatsApp */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enviados WhatsApp</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Send className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-slate-900">{sentPercentage}%</span>
            <span className="text-xs text-slate-500 ml-1.5">({sentCount}/{totalToday})</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {approvedCount} orçamentos já aprovados
          </p>
        </div>

        {/* Card 4: Tempo Médio */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tempo de Criação</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">18 seg</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-0.5" /> Alta agilidade
          </p>
        </div>
      </div>

      {/* Quick Brand Access Pills */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Acesso Rápido por Marca
          </h2>
          <span className="text-xs text-slate-400">Clique para cotar direto</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {BRANDS.map((b) => (
            <button
              key={b.name}
              id={`quick-brand-btn-${b.name.toLowerCase()}`}
              onClick={() => onStartNewQuote(b.name)}
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/40 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{b.icon}</span>
                <div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 block">
                    {b.name}
                  </span>
                  <span className="text-[10px] text-slate-400">Cotar modelo</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Quotes Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Últimos Orçamentos Gerados
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Acompanhe o status e reenvie mensagens instantaneamente
            </p>
          </div>
          <button
            id="view-all-history-btn"
            onClick={onNavigateHistory}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Histórico Completo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentQuotes.map((quote) => {
            const statusConfig = {
              Aprovado: {
                bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                dot: 'bg-emerald-500',
              },
              Enviado: {
                bg: 'bg-blue-50 text-blue-700 border-blue-200',
                dot: 'bg-blue-500',
              },
              Pendente: {
                bg: 'bg-amber-50 text-amber-700 border-amber-200',
                dot: 'bg-amber-500',
              },
              Recusado: {
                bg: 'bg-rose-50 text-rose-700 border-rose-200',
                dot: 'bg-rose-500',
              },
            }[quote.status] || {
              bg: 'bg-slate-50 text-slate-700 border-slate-200',
              dot: 'bg-slate-400',
            };

            return (
              <div
                key={quote.id}
                className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {quote.deviceName}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {quote.serviceName}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusConfig.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                      {quote.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">👤 {quote.clientName}</span>
                    <span>• {quote.createdAt}</span>
                    <span className="hidden sm:inline">• {quote.qualityLabel.split('/')[0]}</span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3 shrink-0">
                  <div>
                    <span className="text-sm sm:text-base font-bold text-slate-900 block">
                      R$ {quote.cashPrice}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      ou {quote.installmentsCount}x de R$ {(quote.installmentsPrice / quote.installmentsCount).toFixed(0)}
                    </span>
                  </div>

                  <button
                    id={`view-quote-${quote.id}`}
                    onClick={() => onViewQuote(quote)}
                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="Ver mensagem WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden md:inline">WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
