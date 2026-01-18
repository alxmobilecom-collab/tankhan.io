
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Send, MapPin, Star, Award, ArrowLeft } from 'lucide-react';

interface AgentPanelProps {
  onBack?: () => void;
}

const AgentPanel: React.FC<AgentPanelProps> = ({ onBack }) => {
  const { locale, tokens, spendTokens } = useApp();
  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState(100);

  const handleGrant = () => {
    if (!targetId) return alert('Enter User ID');
    if (spendTokens(amount)) {
      alert(`Granted ${amount} tokens to ${targetId}`);
      setTargetId('');
    } else {
      alert('Insufficient agent balance');
    }
  };

  return (
    <div className="pt-24 px-8 max-w-5xl mx-auto space-y-12">
      <header className="space-y-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase tracking-wider text-xs">
              {locale === 'RU' ? 'В портал' : 'To Portal'}
            </span>
          </button>
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-manrope font-bold mb-2 flex items-center gap-3">
              <Award className="text-yellow-400" />
              {locale === 'RU' ? 'Панель агента' : 'Agent Panel'}
            </h1>
            <p className="opacity-60">ID: agent_9921 • Level 2 Certified</p>
          </div>
          <div className="glass-card px-6 py-4 rounded-2xl border-purple-500/30">
            <div className="text-xs opacity-60 mb-1">{locale === 'RU' ? 'Ваш баланс' : 'Your Balance'}</div>
            <div className="text-3xl font-bold text-purple-400">{tokens} T</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Grant Section */}
        <section className="glass-card p-8 rounded-3xl space-y-6 border-white/10">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <Send className="text-blue-400" />
            {locale === 'RU' ? 'Раздать токены' : 'Distribute Tokens'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">User ID / Email</label>
              <input 
                type="text" 
                value={targetId}
                onChange={e => setTargetId(e.target.value)}
                placeholder="user_12345"
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 focus:border-purple-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Amount</label>
              <select 
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 outline-none"
              >
                <option value={100}>100 T (1 test)</option>
                <option value={200}>200 T (2 tests)</option>
                <option value={500}>500 T (Full package)</option>
              </select>
            </div>
            <button 
              onClick={handleGrant}
              className="w-full purple-gradient py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform"
            >
              {locale === 'RU' ? 'Начислить токены' : 'Grant Tokens'}
            </button>
          </div>
        </section>

        {/* Profile Stats */}
        <section className="space-y-6">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
              <Users size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold">48</div>
              <div className="text-sm opacity-60">{locale === 'RU' ? 'Клиентов приглашено' : 'Clients Referred'}</div>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center">
              <Star size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold">4.9 / 5.0</div>
              <div className="text-sm opacity-60">{locale === 'RU' ? 'Рейтинг агента' : 'Agent Rating'}</div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <MapPin size={18} />
              {locale === 'RU' ? 'Видимость в каталоге' : 'Catalog Visibility'}
            </h3>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <span>{locale === 'RU' ? 'Показывать мой профиль' : 'Show my profile'}</span>
              <div className="w-12 h-6 bg-purple-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <p className="text-xs opacity-50">
              {locale === 'RU' ? 'Ваш профиль виден в поиске по вашему городу.' : 'Your profile is visible in searches for your city.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AgentPanel;
