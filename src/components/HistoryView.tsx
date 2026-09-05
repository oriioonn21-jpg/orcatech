import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Smartphone,
  Calendar,
  User,
  DollarSign,
  ChevronRight,
  PlusCircle,
  FileText,
} from 'lucide-react';
import { Quote } from '../types';

interface HistoryViewProps {
  quotes: Quote[];
  onViewQuote: (quote: Quote) => void;
  onStatusChange: (quoteId: string, newStatus: Quote['status']) => void;
  onStartNewQuote: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  quotes,
  onViewQuote,
  onStatusChange,
  onStartNewQuote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | Quote['status']>('Todos');

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      // Status filter
      if (statusFilter !== 'Todos' && q.status !== statusFilter) {
        return false;
      }

      // Search term
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        q.clientName.toLowerCase().includes(term) ||
        q.clientPhone.includes(term) ||
        q.deviceName.toLowerCase().includes(term) ||
        q.serviceName.toLowerCase().includes(term) ||
        q.quoteNumber.toLowerCase().includes(term)
      );
    });
  }, [quotes, searchTerm, statusFilter]);

  const getStatusBadge = (status: Quote['status']) => {
    switch (status) {
      case 'Aprovado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Aprovado
          </span>
        );
      case 'Enviado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Send className="w-3 h-3 text-blue-600" />
            Enviado
          </span>
        );
      case 'Pendente':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pendente
          </span>
        );
      case 'Recusado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Recusado
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-24 sm:pb-12">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Histórico de Orçamentos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerenciamento e status de todos os orçamentos criados
          </p>
        </div>

        <button
          id="history-new-quote-btn"
          onClick={onStartNewQuote}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Novo Orçamento</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="history-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, aparelho, serviço ou Nº..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
            {(['Todos', 'Enviado', 'Aprovado', 'Pendente', 'Recusado'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center justify-between">
          <span>Exibindo {filteredQuotes.length} de {quotes.length} orçamentos</span>
          <span className="text-slate-400 hidden sm:inline">Toque para ver a mensagem do WhatsApp</span>
        </div>
      </div>

      {/* Quotes Cards / Table */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-dashed border-slate-200 text-center space-y-2">
          <Smartphone className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Nenhum orçamento encontrado</p>
          <p className="text-xs text-slate-400">
            Tente mudar o filtro de status ou criar um novo orçamento
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
            >
              {/* Left Column: Device & Client & Service */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                    {quote.quoteNumber}
                  </span>
                  <span className="font-bold text-sm sm:text-base text-slate-900">
                    {quote.deviceName}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {quote.serviceName}
                  </span>
                  <div>{getStatusBadge(quote.status)}</div>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">
                      {quote.clientName}
                    </span>
                    {quote.clientPhone && (
                      <span className="text-slate-400 text-[11px]">({quote.clientPhone})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{quote.createdAt}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 hidden md:block">
                    Qualidade: <strong className="text-slate-700">{quote.qualityLabel.split('/')[0]}</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Price & Quick Action */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                <div className="text-left sm:text-right">
                  <span className="text-base sm:text-lg font-bold text-slate-900 block leading-tight">
                    R$ {quote.cashPrice.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    ou {quote.installmentsCount}x de R$ {(quote.installmentsPrice / quote.installmentsCount).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`history-whatsapp-btn-${quote.id}`}
                    onClick={() => onViewQuote(quote)}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Ver mensagem para WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  {quote.status !== 'Aprovado' && (
                    <button
                      id={`history-approve-btn-${quote.id}`}
                      onClick={() => onStatusChange(quote.id, 'Aprovado')}
                      className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                      title="Marcar como aprovado"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
