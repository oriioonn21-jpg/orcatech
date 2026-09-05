import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Navbar, NavTab } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { NewQuoteView } from './components/NewQuoteView';
import { HistoryView } from './components/HistoryView';
import { AdminView } from './components/AdminView';
import { QuotePreviewModal } from './components/QuotePreviewModal';
import { StaffMember, StoreLocation, Quote, BrandName } from './types';
import { STAFF_MEMBERS, STORES, INITIAL_QUOTES } from './data/mockData';

export default function App() {
  // Session state: starts with default technician for instant preview, can toggle to login screen
  const [currentUser, setCurrentUser] = useState<StaffMember | null>(STAFF_MEMBERS[0]);
  const [currentStore, setCurrentStore] = useState<StoreLocation>(STORES[0]);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Quotes state
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [selectedQuoteForPreview, setSelectedQuoteForPreview] = useState<Quote | null>(null);
  const [preSelectedBrand, setPreSelectedBrand] = useState<BrandName | undefined>(undefined);

  // If user is logged out, show LoginView
  if (!currentUser) {
    return (
      <LoginView
        onLogin={(user, store) => {
          setCurrentUser(user);
          setCurrentStore(store);
          setActiveTab('dashboard');
        }}
      />
    );
  }

  // Handle fast transition to New Quote
  const handleStartNewQuote = (brand?: BrandName) => {
    setPreSelectedBrand(brand);
    setActiveTab('new-quote');
  };

  // Handle quote generation
  const handleQuoteGenerated = (newQuote: Quote) => {
    setQuotes((prev) => [newQuote, ...prev]);
    setSelectedQuoteForPreview(newQuote);
  };

  // Handle status changes (Enviado, Aprovado, Recusado)
  const handleStatusChange = (quoteId: string, newStatus: Quote['status']) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
    );
    if (selectedQuoteForPreview && selectedQuoteForPreview.id === quoteId) {
      setSelectedQuoteForPreview((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const pendingCount = quotes.filter((q) => q.status === 'Pendente').length;

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-[#1E293B] overflow-hidden">
      {/* Desktop Clean Minimalism Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setPreSelectedBrand(undefined);
          setActiveTab(tab);
        }}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        pendingQuotesCount={pendingCount}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          currentStore={currentStore}
          stores={STORES}
          onSelectStore={setCurrentStore}
          onLogout={() => setCurrentUser(null)}
          onNewQuoteClick={() => handleStartNewQuote()}
          activeTab={activeTab}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto w-full">
            {activeTab === 'dashboard' && (
              <DashboardView
                currentUser={currentUser}
                currentStore={currentStore}
                quotes={quotes}
                onStartNewQuote={handleStartNewQuote}
                onViewQuote={(quote) => setSelectedQuoteForPreview(quote)}
                onNavigateHistory={() => setActiveTab('history')}
              />
            )}

            {activeTab === 'new-quote' && (
              <NewQuoteView
                currentUser={currentUser}
                currentStore={currentStore}
                initialBrand={preSelectedBrand}
                onQuoteGenerated={handleQuoteGenerated}
                onCancel={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView
                quotes={quotes}
                onViewQuote={(quote) => setSelectedQuoteForPreview(quote)}
                onStatusChange={handleStatusChange}
                onStartNewQuote={() => handleStartNewQuote()}
              />
            )}

            {activeTab === 'admin' && <AdminView />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Floating Dock Bar */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setPreSelectedBrand(undefined);
          setActiveTab(tab);
        }}
        pendingQuotesCount={pendingCount}
      />

      {/* WhatsApp Message Preview & Send Modal */}
      {selectedQuoteForPreview && (
        <QuotePreviewModal
          quote={selectedQuoteForPreview}
          isOpen={!!selectedQuoteForPreview}
          onClose={() => setSelectedQuoteForPreview(null)}
          onStatusChange={handleStatusChange}
          onNewQuoteAgain={() => {
            setSelectedQuoteForPreview(null);
            handleStartNewQuote();
          }}
        />
      )}
    </div>
  );
}
