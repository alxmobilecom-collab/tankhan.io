
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Locale, Transaction } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  tokens: number;
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => boolean;
  transactions: Transaction[];
  login: (role: 'client' | 'agent' | 'admin') => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [locale, setLocale] = useState<Locale>('RU');
  const [tokens, setTokens] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Persist state
  useEffect(() => {
    const saved = localStorage.getItem('tanakh_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed.user);
      setTokens(parsed.tokens || 0);
      setLocale(parsed.locale || 'RU');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tanakh_state', JSON.stringify({ user, tokens, locale }));
  }, [user, tokens, locale]);

  const login = (role: 'client' | 'agent' | 'admin') => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      role,
      tokens: 0,
      completedTests: []
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setTokens(0);
  };

  const addTokens = (amount: number) => {
    setTokens(prev => prev + amount);
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'anon',
      amount,
      type: 'purchase',
      timestamp: Date.now()
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const spendTokens = (amount: number) => {
    if (tokens >= amount) {
      setTokens(prev => prev - amount);
      const tx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user?.id || 'unknown',
        amount: -amount,
        type: 'spend',
        timestamp: Date.now()
      };
      setTransactions(prev => [tx, ...prev]);
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider value={{
      user, setUser, locale, setLocale, tokens, addTokens, spendTokens, transactions, login, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
