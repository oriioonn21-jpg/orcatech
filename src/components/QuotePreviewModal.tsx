import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Copy,
  Check,
  Send,
  ExternalLink,
  ThumbsUp,
  Share2,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCheck,
} from 'lucide-react';
import { Quote } from '../types';

interface QuotePreviewModalProps {
  quote: Quote;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (quoteId: string, newStatus: Quote['status']) => void;
  onNewQuoteAgain: () => void;
}

export const QuotePreviewModal: React.FC<QuotePreviewModalProps> = ({
  quote,
  isOpen,
  onClose,
  onStatusChange,
  onNewQuoteAgain,
}) => {
  const [copied, setCopied] = useState(false);
  const [simulatedSent, setSimulatedSent] = useState(quote.status === 'Enviado');
  const [isApproved, setIsApproved] = useState(quote.status === 'Aprovado');

  if (!isOpen) return null;

  // Format WhatsApp Message Text
  const messageText = `🔧 *ORÇATECH ASSISTÊNCIA TÉCNICA* 📱
Olá, *${quote.clientName || 'Cliente'}*! Tudo bem?
Aqui está o orçamento detalhado para o seu aparelho:

📱 *Aparelho:* ${quote.deviceName}
🛠️ *Serviço:* ${quote.serviceName}
💎 *Qualidade:* ${quote.qualityLabel}
🛡️ *Garantia:* ${quote.warranty}
🚚 *Modalidade:* ${quote.serviceTypeName || 'Atendimento na Loja'}
⏱️ *Prazo de Execução:* ${quote.deliveryTime}

💰 *VALOR:*
• *R$ ${quote.cashPrice.toFixed(2).replace('.', ',')}* à vista (Pix ou Dinheiro)
• Ou até ${quote.installmentsCount}x de *R$ ${(quote.installmentsPrice / quote.installmentsCount).toFixed(2).replace('.', ',')}* no cartão

📍 *Unidade:* ${quote.storeName}
👨‍🔧 *Técnico Responsável:* ${quote.technicianName}
🔖 *Orçamento Nº:* ${quote.quoteNumber}

✅ _Peça disponível para reparo imediato!_
Deseja aprovar e reservar o seu horário hoje?`;

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Requirement 10: "10. Criar um botão: 'ENVIAR PELO WHATSAPP'. Por enquanto esse botão pode apenas simular o envio."
  const handleSimulateWhatsAppSend = () => {
    setSimulatedSent(true);
    onStatusChange(quote.id, 'Enviado');

    // If client phone exists, user can optionally also open real WhatsApp
    const cleanPhone = quote.clientPhone.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
      const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
      const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(messageText)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleApprove = () => {
    setIsApproved(true);
    onStatusChange(quote.id, 'Aprovado');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
              <MessageCircle className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Prévia da Mensagem para o Cliente
              </h3>
              <p className="text-[11px] text-slate-400">
                Orçamento #{quote.quoteNumber} • {quote.deviceName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: WhatsApp Chat Simulation */}
        <div className="p-4 sm:p-5 bg-slate-100/90 space-y-4">
          {/* Simulated WhatsApp Wallpaper and Bubble */}
          <div className="bg-[#EFEAE2] p-3 sm:p-4 rounded-xl shadow-inner border border-slate-300/80 relative">
            <div className="text-[10px] text-center text-slate-500 font-semibold mb-2">
              Mensagem formatada para WhatsApp
            </div>

            {/* Bubble */}
            <div className="bg-white rounded-xl rounded-tl-xs p-3.5 shadow-sm max-w-sm text-xs text-slate-800 space-y-2 border border-slate-200/60 relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 font-bold text-emerald-800">
                <span>🔧 ORÇATECH ASSISTÊNCIA 📱</span>
                <span className="text-[10px] text-slate-400 font-normal">Hoje</span>
              </div>

              <p>
                Olá, <strong>{quote.clientName || 'Cliente'}</strong>! Tudo bem?<br />
                Aqui está o orçamento detalhado para o seu aparelho:
              </p>

              <div className="bg-slate-50 p-2 rounded-lg space-y-1 text-[11px] border border-slate-100 font-medium">
                <div>📱 <strong>Aparelho:</strong> {quote.deviceName}</div>
                <div>🛠️ <strong>Serviço:</strong> {quote.serviceName}</div>
                <div>💎 <strong>Qualidade:</strong> {quote.qualityLabel}</div>
                <div>🛡️ <strong>Garantia:</strong> {quote.warranty}</div>
                <div>🚚 <strong>Atendimento:</strong> {quote.serviceTypeName || 'Atendimento na Loja'}</div>
                <div>⏱️ <strong>Prazo:</strong> {quote.deliveryTime}</div>
              </div>

              <div className="bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/70 text-slate-900">
                <div className="font-extrabold text-emerald-900 text-xs mb-0.5">💰 VALORES:</div>
                <div className="text-sm font-black text-emerald-700">
                  R$ {quote.cashPrice.toFixed(2).replace('.', ',')} à vista
                </div>
                <div className="text-[10px] text-slate-600">
                  Ou {quote.installmentsCount}x de R$ {(quote.installmentsPrice / quote.installmentsCount).toFixed(2).replace('.', ',')} no cartão
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-1">
                📍 {quote.storeName} • Resp: {quote.technicianName}
              </div>

              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                <span>10:30</span>
                <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />
              </div>
            </div>
          </div>

          {/* Success Banner if Simulated Send was clicked */}
          {simulatedSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-semibold animate-in fade-in">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Status atualizado: <strong>Enviado ao Cliente</strong></span>
              </div>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                Registrado
              </span>
            </div>
          )}

          {isApproved && (
            <div className="p-3 bg-blue-50 border border-blue-300 rounded-xl flex items-center justify-between text-blue-800 text-xs font-semibold animate-in fade-in">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Orçamento marcado como <strong>Aprovado pelo Cliente! 🎉</strong></span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5">
            {/* ENVIAR PELO WHATSAPP */}
            <button
              id="btn-send-whatsapp-action"
              type="button"
              onClick={handleSimulateWhatsAppSend}
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>ENVIAR PELO WHATSAPP</span>
              {simulatedSent && <Check className="w-4 h-4" />}
            </button>

            {/* Copy button & Quick status */}
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-copy-quote-text"
                type="button"
                onClick={handleCopy}
                className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>

              <button
                id="btn-mark-approved"
                type="button"
                onClick={handleApprove}
                className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ThumbsUp className="w-4 h-4 text-blue-600" />
                <span>Cliente Aprovou</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            Fechar Janela
          </button>

          <button
            onClick={() => {
              onClose();
              onNewQuoteAgain();
            }}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>+ Novo Orçamento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
