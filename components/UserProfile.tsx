
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, 
  Coins, 
  History, 
  Settings, 
  Share2, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Scale,
  Ruler,
  Calendar,
  Save,
  Edit3,
  Users
} from 'lucide-react';

const UserProfile: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, setUser, locale, tokens, transactions, logout } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    weight: user?.weight || '',
    height: user?.height || '',
    age: user?.age || '',
    gender: user?.gender || ''
  });

  if (!user) return null;

  const handleSave = () => {
    setUser({
      ...user,
      weight: Number(formData.weight) || undefined,
      height: Number(formData.height) || undefined,
      age: Number(formData.age) || undefined,
      gender: (formData.gender as any) || undefined
    });
    setIsEditing(false);
  };

  const PhysicalMetric = ({ icon: Icon, label, value, unit }: { icon: any, label: string, value: string | number | undefined, unit?: string }) => (
    <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 border border-white/5">
      <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-[10px] uppercase font-bold opacity-40 tracking-widest mb-0.5">{label}</div>
        <div className="text-lg font-manrope font-bold">
          {value ? (unit ? `${value} ${unit}` : value) : '—'}
        </div>
      </div>
    </div>
  );

  const genderLabels: Record<string, Record<string, string>> = {
    male: { RU: 'Мужской', EN: 'Male' },
    female: { RU: 'Женский', EN: 'Female' },
    other: { RU: 'Другой', EN: 'Other' }
  };

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative group">
          <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative w-32 h-32 rounded-[2.5rem] purple-gradient flex items-center justify-center text-5xl font-bold shadow-2xl border-4 border-white/10">
            {user.id[0].toUpperCase()}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-[#0f0a1f] flex items-center justify-center" title="Online">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h2 className="text-3xl font-manrope font-extrabold">{user.id}</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30">
              <ShieldCheck size={12} />
              {user.role}
            </span>
          </div>
          <p className="opacity-60 text-sm max-w-md">
            {locale === 'RU' 
              ? 'Участник экосистемы TANAKH. Исследуйте свой потенциал и получайте награды.' 
              : 'TANAKH Ecosystem member. Explore your potential and earn rewards.'}
          </p>
          <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
             <button 
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-xs font-bold"
             >
               <LogOut size={14} />
               {locale === 'RU' ? 'Выйти' : 'Logout'}
             </button>
             {user.role !== 'client' && (
                <button 
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold"
                >
                  {locale === 'RU' ? 'В панель управления' : 'To Dashboard'}
                  <ChevronRight size={14} />
                </button>
             )}
          </div>
        </div>
      </div>

      {/* Physical Profile Editor */}
      <section className="glass-card p-6 md:p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <UserIcon size={120} />
        </div>
        
        <div className="flex justify-between items-center mb-8 relative">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <Scale size={20} className="text-purple-400" />
            {locale === 'RU' ? 'Физический профиль' : 'Physical Profile'}
          </h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 px-4 py-2 rounded-full"
          >
            {isEditing ? (locale === 'RU' ? 'Отмена' : 'Cancel') : (
              <>
                <Edit3 size={14} />
                {locale === 'RU' ? 'Изменить' : 'Edit'}
              </>
            )}
          </button>
        </div>

        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative animate-in slide-in-from-top-2">
            <div className="space-y-2">
              <label className="text-xs font-bold opacity-40 uppercase tracking-widest ml-1">{locale === 'RU' ? 'Пол' : 'Gender'}</label>
              <div className="flex gap-2">
                {['male', 'female', 'other'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setFormData({...formData, gender: g})}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                      formData.gender === g 
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' 
                        : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {genderLabels[g][locale]}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold opacity-40 uppercase tracking-widest ml-1">{locale === 'RU' ? 'Вес (кг)' : 'Weight (kg)'}</label>
              <div className="relative">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500/50 outline-none transition-all"
                  placeholder="75"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold opacity-40 uppercase tracking-widest ml-1">{locale === 'RU' ? 'Рост (см)' : 'Height (cm)'}</label>
              <div className="relative">
                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                  type="number" 
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500/50 outline-none transition-all"
                  placeholder="180"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold opacity-40 uppercase tracking-widest ml-1">{locale === 'RU' ? 'Возраст' : 'Age'}</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500/50 outline-none transition-all"
                  placeholder="25"
                />
              </div>
            </div>
            <div className="md:col-span-2 lg:col-span-4 pt-2">
              <button 
                onClick={handleSave}
                className="w-full purple-gradient py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20 active:scale-95 transition-transform"
              >
                <Save size={18} />
                {locale === 'RU' ? 'Сохранить изменения' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <PhysicalMetric icon={Users} label={locale === 'RU' ? 'Пол' : 'Gender'} value={user.gender ? genderLabels[user.gender][locale] : undefined} />
            <PhysicalMetric icon={Scale} label={locale === 'RU' ? 'Вес' : 'Weight'} value={user.weight} unit="kg" />
            <PhysicalMetric icon={Ruler} label={locale === 'RU' ? 'Рост' : 'Height'} value={user.height} unit="cm" />
            <PhysicalMetric icon={Calendar} label={locale === 'RU' ? 'Возраст' : 'Age'} value={user.age} unit={locale === 'RU' ? 'лет' : 'years'} />
          </div>
        )}
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-3xl border-purple-500/20 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <Coins size={120} />
          </div>
          <div className="flex items-center gap-3 mb-4 text-purple-400">
            <div className="p-2 bg-purple-500/20 rounded-lg"><Coins size={20} /></div>
            <span className="text-xs font-bold uppercase tracking-widest">{locale === 'RU' ? 'Баланс' : 'Balance'}</span>
          </div>
          <div className="text-4xl font-manrope font-black">{tokens} T</div>
          <p className="text-[10px] opacity-40 mt-2 uppercase">≈ {(tokens / 10).toFixed(2)} USD</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border-blue-500/20 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <div className="p-2 bg-blue-500/20 rounded-lg"><TrendingUp size={20} /></div>
            <span className="text-xs font-bold uppercase tracking-widest">{locale === 'RU' ? 'Тесты' : 'Tests'}</span>
          </div>
          <div className="text-4xl font-manrope font-black">{user.completedTests.length}</div>
          <p className="text-[10px] opacity-40 mt-2 uppercase">{locale === 'RU' ? 'Пройдено' : 'Completed'}</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border-green-500/20 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <Share2 size={120} />
          </div>
          <div className="flex items-center gap-3 mb-4 text-green-400">
            <div className="p-2 bg-green-500/20 rounded-lg"><Share2 size={20} /></div>
            <span className="text-xs font-bold uppercase tracking-widest">{locale === 'RU' ? 'Рефералы' : 'Referrals'}</span>
          </div>
          <div className="text-4xl font-manrope font-black">0</div>
          <p className="text-[10px] opacity-40 mt-2 uppercase">{locale === 'RU' ? 'Приглашено' : 'Invited'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction History */}
        <section className="glass-card rounded-3xl overflow-hidden border-white/5 flex flex-col h-full">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <History size={18} className="text-purple-400" />
              {locale === 'RU' ? 'История операций' : 'Transaction History'}
            </h3>
            <button className="text-[10px] uppercase font-bold text-purple-400 hover:underline">
              {locale === 'RU' ? 'Все' : 'View All'}
            </button>
          </div>
          <div className="flex-grow">
            {transactions.length > 0 ? (
              <div className="divide-y divide-white/5">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === 'spend' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                      }`}>
                        <Coins size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold capitalize">{tx.type === 'spend' ? (locale === 'RU' ? 'Списание' : 'Spend') : (locale === 'RU' ? 'Пополнение' : 'Top-up')}</div>
                        <div className="text-[10px] opacity-40">{new Date(tx.timestamp).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className={`font-mono font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} T
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center opacity-30 flex flex-col items-center gap-2">
                <History size={48} />
                <p>{locale === 'RU' ? 'Операций пока нет' : 'No transactions yet'}</p>
              </div>
            )}
          </div>
        </section>

        {/* Settings and Referral */}
        <div className="space-y-8">
          <section className="glass-card p-6 rounded-3xl border-white/5 space-y-6">
            <h3 className="font-bold flex items-center gap-2">
              <Settings size={18} className="text-purple-400" />
              {locale === 'RU' ? 'Настройки профиля' : 'Profile Settings'}
            </h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                 <div className="text-sm">
                   <p className="font-medium">{locale === 'RU' ? 'Уведомления' : 'Notifications'}</p>
                   <p className="text-[10px] opacity-40">{locale === 'RU' ? 'О новых тестах и акциях' : 'About new tests and promos'}</p>
                 </div>
                 <div className="w-10 h-5 bg-purple-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                 </div>
               </div>
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                 <div className="text-sm">
                   <p className="font-medium">{locale === 'RU' ? 'Приватный профиль' : 'Private Profile'}</p>
                   <p className="text-[10px] opacity-40">{locale === 'RU' ? 'Скрыть статистику от агентов' : 'Hide stats from agents'}</p>
                 </div>
                 <div className="w-10 h-5 bg-gray-600 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                 </div>
               </div>
            </div>
          </section>

          <section className="glass-card p-6 rounded-3xl border-purple-500/30 bg-purple-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Share2 size={64} />
            </div>
            <h3 className="font-bold text-xl mb-2">{locale === 'RU' ? 'Приглашайте друзей' : 'Invite Friends'}</h3>
            <p className="text-sm opacity-70 mb-6">
              {locale === 'RU' 
                ? 'Получайте по 50 T за каждого приглашенного пользователя, который пройдет первый тест.' 
                : 'Earn 50 T for every friend who completes their first test.'}
            </p>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={`tanakh.io/ref/${user.id}`} 
                className="flex-grow bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono outline-none"
              />
              <button className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">
                {locale === 'RU' ? 'Копировать' : 'Copy'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
