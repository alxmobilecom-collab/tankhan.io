
import React from 'react';
import { useApp } from '../context/AppContext';
import { Coins, LogIn, LogOut, User, Menu } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onLogoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onLogoClick }) => {
  const { locale, setLocale, tokens, user, logout } = useApp();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card px-4 py-3 md:px-8 flex justify-between items-center">
      <button 
        onClick={onLogoClick}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none group"
      >
        <div className="w-10 h-10 purple-gradient rounded-xl flex items-center justify-center font-bold text-xl text-white group-hover:scale-105 transition-transform">T</div>
        <span className="font-manrope font-bold text-lg hidden md:block tracking-tight text-white uppercase">TANAKH</span>
      </button>

      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={() => setLocale(locale === 'RU' ? 'EN' : 'RU')}
          className="text-sm font-semibold hover:text-purple-400 transition-colors"
        >
          {locale === 'RU' ? 'EN' : 'RU'}
        </button>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-900/40 px-3 py-1.5 rounded-full border border-purple-500/30">
              <Coins size={16} className="text-yellow-400" />
              <span className="font-bold">{tokens}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        ) : (
          <button 
            onClick={onOpenAuth}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-all text-sm font-bold shadow-lg shadow-purple-600/20"
          >
            <LogIn size={18} />
            {locale === 'RU' ? 'Войти' : 'Login'}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
