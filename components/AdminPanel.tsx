
import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Users, Database, Shield, BarChart3, Mail, ArrowLeft } from 'lucide-react';

interface AdminPanelProps {
  onBack?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const { locale, transactions } = useApp();

  return (
    <div className="pt-24 px-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group self-start"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase tracking-wider text-xs">
              {locale === 'RU' ? 'В портал' : 'To Portal'}
            </span>
          </button>
        )}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-manrope font-bold flex items-center gap-4">
            <Shield className="text-red-500" />
            {locale === 'RU' ? 'Админ-панель' : 'Admin Panel'}
          </h1>
          <div className="bg-white/10 px-4 py-2 rounded-lg text-sm font-mono">
            System: Online
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Users, label: { RU: 'Пользователи', EN: 'Users' }, val: '1,234' },
          { icon: BarChart3, label: { RU: 'Конверсия', EN: 'Conversion' }, val: '12.5%' },
          { icon: Database, label: { RU: 'Транзакции', EN: 'Transactions' }, val: '8,432' },
          { icon: Mail, label: { RU: 'Тикеты', EN: 'Tickets' }, val: '24' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl">
            <stat.icon className="text-purple-400 mb-4" />
            <div className="text-sm opacity-60">{stat.label[locale]}</div>
            <div className="text-2xl font-bold">{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold">{locale === 'RU' ? 'Последние операции' : 'Recent Operations'}</h3>
            <button className="text-xs text-purple-400 hover:underline">Export CSV</button>
          </div>
          <div className="p-0">
            <table className="w-full text-left">
              <thead className="text-xs opacity-50 border-b border-white/10">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.length > 0 ? transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-xs font-mono">{tx.id}</td>
                    <td className="p-4">{tx.userId.substring(0,8)}...</td>
                    <td className={`p-4 font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} T
                    </td>
                    <td className="p-4 capitalize text-sm">{tx.type}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center opacity-40">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-6">
          <h3 className="font-bold flex items-center gap-2">
            <Settings size={18} />
            {locale === 'RU' ? 'Настройки бота' : 'Bot Settings'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs opacity-50 mb-1">Telegram Bot Token</label>
              <input type="password" value="••••••••••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm" readOnly />
            </div>
            <div>
              <label className="block text-xs opacity-50 mb-1">Channel ID</label>
              <input type="text" value="@tanakh_private" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm" readOnly />
            </div>
            <button className="w-full purple-gradient py-3 rounded-xl font-bold">
              {locale === 'RU' ? 'Сохранить' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
