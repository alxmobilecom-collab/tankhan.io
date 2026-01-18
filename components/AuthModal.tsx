
import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Github, Chrome, MessageCircle } from 'lucide-react';

const AuthModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { login, locale } = useApp();

  const handleLogin = (role: 'client' | 'agent' | 'admin') => {
    login(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-md glass-card p-8 rounded-[2.5rem] space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-manrope font-bold">
            {locale === 'RU' ? 'Добро пожаловать' : 'Welcome back'}
          </h2>
          <p className="opacity-60 text-sm">
            {locale === 'RU' ? 'Выберите способ входа для продолжения' : 'Choose your preferred login method'}
          </p>
        </div>

        <div className="grid gap-4">
          <button 
            onClick={() => handleLogin('client')}
            className="flex items-center justify-center gap-3 bg-white text-black py-3.5 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            <Chrome size={20} />
            {locale === 'RU' ? 'Войти через Google' : 'Sign in with Google'}
          </button>
          <button 
            onClick={() => handleLogin('client')}
            className="flex items-center justify-center gap-3 bg-[#0088cc] text-white py-3.5 rounded-2xl font-bold hover:opacity-90 transition-all"
          >
            <MessageCircle size={20} fill="currentColor" />
            {locale === 'RU' ? 'Войти через Telegram' : 'Sign in with Telegram'}
          </button>
          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs opacity-40">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
          <button 
            onClick={() => handleLogin('client')}
            className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 py-3.5 rounded-2xl font-semibold border border-white/10 transition-all"
          >
            <Mail size={20} />
            Email
          </button>
        </div>

        <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleLogin('agent')}
            className="text-xs text-center opacity-60 hover:opacity-100 transition-opacity"
          >
            {locale === 'RU' ? 'Я Агент' : 'I am an Agent'}
          </button>
          <button 
            onClick={() => handleLogin('admin')}
            className="text-xs text-center opacity-60 hover:opacity-100 transition-opacity"
          >
            {locale === 'RU' ? 'Я Админ' : 'I am Admin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
