
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import Navbar from './components/Navbar.tsx';
import LandingPage from './components/LandingPage.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import AgentPanel from './components/AgentPanel.tsx';
import AuthModal from './components/AuthModal.tsx';
import FooterMenu from './components/FooterMenu.tsx';
import UserProfile from './components/UserProfile.tsx';
import FoodScanner from './components/FoodScanner.tsx';
import { ArrowLeft, Lock, LogIn } from 'lucide-react';

const AuthRequiredView: React.FC<{ icon: React.ReactNode, title: string, desc: string, onAuth: () => void }> = ({ icon, title, desc, onAuth }) => (
  <div className="pt-40 px-6 max-w-md mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
    <div className="relative inline-block">
      <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20"></div>
      <div className="relative w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-purple-400 mx-auto">
        {icon}
        <div className="absolute -top-2 -right-2 bg-red-500 p-1.5 rounded-lg border-4 border-[#0f0a1f]">
          <Lock size={12} className="text-white" />
        </div>
      </div>
    </div>
    <div className="space-y-2">
      <h2 className="text-2xl font-manrope font-extrabold">{title}</h2>
      <p className="text-sm opacity-60 leading-relaxed">{desc}</p>
    </div>
    <button 
      onClick={onAuth}
      className="w-full purple-gradient py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20 active:scale-95 transition-transform"
    >
      <LogIn size={20} />
      Войти или Создать аккаунт
    </button>
  </div>
);

const AppContent: React.FC = () => {
  const { user, locale } = useApp();
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [viewOverride, setViewOverride] = useState<string | null>(null);

  const handleGoHome = () => {
    setActiveTab('home');
    setViewOverride('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const BackButton = () => (
    <button 
      onClick={() => setActiveTab('home')}
      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6 group"
    >
      <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      <span className="font-bold uppercase tracking-wider text-sm">
        {locale === 'RU' ? 'Назад' : 'Back'}
      </span>
    </button>
  );

  const renderProtected = (component: React.ReactNode, title: string, desc: string, Icon: React.ReactNode) => {
    if (!user) return <AuthRequiredView icon={Icon} title={title} desc={desc} onAuth={() => setShowAuth(true)} />;
    return component;
  };

  const renderView = () => {
    if (user?.role === 'admin' && viewOverride !== 'portal') return <AdminPanel onBack={() => setViewOverride('portal')} />;
    if (user?.role === 'agent' && viewOverride !== 'portal') return <AgentPanel onBack={() => setViewOverride('portal')} />;

    switch (activeTab) {
      case 'home':
        return <LandingPage onAuthRequired={() => setShowAuth(true)} />;
      case 'scan':
        return renderProtected(
          <FoodScanner />,
          locale === 'RU' ? 'AI Сканер Еды' : 'AI Food Scanner',
          locale === 'RU' ? 'Используйте камеру для мгновенного анализа КБЖУ ваших блюд.' : 'Use your camera for instant nutritional analysis of your meals.',
          <FoodScannerIcon />
        );
      case 'wallet':
        return renderProtected(
          <div className="pt-32 px-8 max-w-4xl mx-auto">
            <BackButton />
            <h2 className="text-3xl font-bold mb-8 text-center">{locale === 'RU' ? 'Ваш Кошелек' : 'Your Wallet'}</h2>
            <div className="glass-card p-12 rounded-3xl border-purple-500/30 text-center">
              <p className="opacity-60 mb-10">Wallet module is being synced with Telegram Stars...</p>
              <div className="text-5xl font-bold text-purple-400">0 T</div>
            </div>
          </div>,
          locale === 'RU' ? 'Ваш Кошелек' : 'Your Wallet',
          locale === 'RU' ? 'Управляйте своими токенами TANAKH и совершайте покупки.' : 'Manage your TANAKH tokens and make purchases.',
          <WalletIcon />
        );
      case 'agents':
        return renderProtected(
          <div className="pt-32 px-8 max-w-4xl mx-auto">
            <BackButton />
            <h2 className="text-3xl font-bold mb-8 text-center">{locale === 'RU' ? 'Каталог Агентов' : 'Agent Catalog'}</h2>
            <div className="glass-card p-12 rounded-3xl text-center">
               <p className="opacity-60">Coming soon in Phase 2: Geolocation search and booking.</p>
            </div>
          </div>,
          locale === 'RU' ? 'Каталог Агентов' : 'Agent Catalog',
          locale === 'RU' ? 'Найдите сертифицированного агента TANAKH в вашем городе.' : 'Find a certified TANAKH agent in your city.',
          <AgentsIcon />
        );
      case 'profile':
        return renderProtected(
          <UserProfile onBack={() => setViewOverride(null)} />,
          locale === 'RU' ? 'Личный Кабинет' : 'Personal Cabinet',
          locale === 'RU' ? 'Просматривайте свои достижения, историю тестов и рефералов.' : 'View your achievements, test history, and referrals.',
          <ProfileIcon />
        );
      default:
        return <LandingPage onAuthRequired={() => setShowAuth(true)} />;
    }
  };

  return (
    <div className="min-h-screen tanakh-gradient relative pb-24">
      <Navbar 
        onOpenAuth={() => setShowAuth(true)} 
        onLogoClick={handleGoHome}
      />
      
      {renderView()}

      <FooterMenu activeTab={activeTab} setActiveTab={setActiveTab} />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      
      {!user && activeTab === 'home' && (
        <footer className="py-12 px-8 border-t border-white/5 text-center mt-24">
          <div className="opacity-40 text-sm">
            &copy; 2024 TANAKH Ecosystem. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
};

const FoodScannerIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12V7a2 2 0 0 1 2-2h5"/><path d="M15 5h5a2 2 0 0 1 2 2v5"/><path d="M2 17v2a2 2 0 0 0 2 2h5"/><path d="M15 21h5a2 2 0 0 0 2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m16 16 2 2"/></svg>
);
const WalletIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
);
const AgentsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const ProfileIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

