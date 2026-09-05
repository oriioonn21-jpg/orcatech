import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Navbar, NavTab } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { NewQuoteView } from './components/NewQuoteView';
import { HistoryView } from './components/HistoryView';
import { AdminView } from './components/AdminView';
import { QuotePreviewModal } from './components/QuotePreviewModal';
import { StaffMember, StoreLocation, Quote, BrandName, CompanyQuoteSettings } from './types';
import { STAFF_MEMBERS, STORES, INITIAL_QUOTES, COMPANIES } from './data/mockData';
import { getCompanySettings, saveCompanySettings } from './data/settingsStorage';

export default function App() {
  // Session state: starts with default technician for instant preview, can toggle to login screen
  const [currentUser, setCurrentUser] = useState<StaffMember | null>(STAFF_MEMBERS[0]);
  const [currentStore, setCurrentStore] = useState<StoreLocation>(STORES[0]);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Multi-tenancy: active company state
  const [currentCompanyId, setCurrentCompanyId] = useState<string>(() => {
    return STAFF_MEMBERS[0]?.companyId || COMPANIES[0].id;
  });

  const currentCompany = useMemo(() => {
    return COMPANIES.find((c) => c.id === currentCompanyId) || COMPANIES[0];
  }, [currentCompanyId]);

  // Company isolated quote settings (warranties, qualities, serviceTypes, technicians)
  const [companySettings, setCompanySettings] = useState<CompanyQuoteSettings>(() => {
    return getCompanySettings(STAFF_MEMBERS[0]?.companyId || COMPANIES[0].id);
  });

  // Quotes state
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [selectedQuoteForPreview, setSelectedQuoteForPreview] = useState<Quote | null>(null);
  const [preSelectedBrand, setPreSelectedBrand] = useState<BrandName | undefined>(undefined);

  // Update company settings handler (isolated per company in localStorage)
  const handleUpdateCompanySettings = (newSettings: CompanyQuoteSettings) => {
    saveCompanySettings(newSettings);
    setCompanySettings(newSettings);
  };

  // Switch company handler (e.g. for testing multi-tenant isolation)
  const handleSwitchCompany = (newCompanyId: string) => {
    setCurrentCompanyId(newCompanyId);
    const newSettings = getCompanySettings(newCompanyId);
    setCompanySettings(newSettings);

    // Switch to a staff member of the new company if available
    const matchingStaff = STAFF_MEMBERS.find((s) => s.companyId === newCompanyId);
    if (matchingStaff) {
      setCurrentUser(matchingStaff);
    }
    const matchingStore = STORES.find((st) => st.companyId === newCompanyId);
    if (matchingStore) {
      setCurrentStore(matchingStore);
    }
  };

  // If user is logged out, show LoginView
  if (!currentUser) {
    return (
      <LoginView
        onLogin={(user, store) => {
          setCurrentUser(user);
          setCurrentStore(store);
          const compId = user.companyId || store.companyId || COMPANIES[0].id;
          setCurrentCompanyId(compId);
          setCompanySettings(getCompanySettings(compId));
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
    const stampedQuote: Quote = {
      ...newQuote,
      companyId: currentCompany.id,
    };
    setQuotes((prev) => [stampedQuote, ...prev]);
    setSelectedQuoteForPreview(stampedQuote);
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

  // Filter quotes by company to guarantee that company data is isolated
  const companyQuotes = quotes.filter(
    (q) => !q.companyId || q.companyId === currentCompany.id
  );
  const pendingCount = companyQuotes.filter((q) => q.status === 'Pendente').length;

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
                quotes={companyQuotes}
                onStartNewQuote={handleStartNewQuote}
                onViewQuote={(quote) => setSelectedQuoteForPreview(quote)}
                onNavigateHistory={() => setActiveTab('history')}
              />
            )}

            {activeTab === 'new-quote' && (
              <NewQuoteView
                currentUser={currentUser}
                currentStore={currentStore}
                companySettings={companySettings}
                initialBrand={preSelectedBrand}
                onQuoteGenerated={handleQuoteGenerated}
                onCancel={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView
                quotes={companyQuotes}
                onViewQuote={(quote) => setSelectedQuoteForPreview(quote)}
                onStatusChange={handleStatusChange}
                onStartNewQuote={() => handleStartNewQuote()}
              />
            )}

            {activeTab === 'admin' && (
              <AdminView
                currentUser={currentUser}
                currentStore={currentStore}
                currentCompany={currentCompany}
                companySettings={companySettings}
                stores={STORES}
                onUpdateCompanySettings={handleUpdateCompanySettings}
                onSwitchCompany={handleSwitchCompany}
                companies={COMPANIES}
                onNavigateNewQuote={handleStartNewQuote}
              />
            )}
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
