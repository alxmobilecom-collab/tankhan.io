
import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, UserCircle, Camera } from 'lucide-react';

interface FooterMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FooterMenu: React.FC<FooterMenuProps> = ({ activeTab, setActiveTab }) => {
  const { locale } = useApp();

  const menuItems = [
    { id: 'home', icon: Home, label: { RU: 'Главная', EN: 'Home' } },
    { id: 'scan', icon: Camera, label: { RU: 'Сканер', EN: 'Scan' } },
    { id: 'profile', icon: UserCircle, label: { RU: 'Профиль', EN: 'Profile' } },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-sm pointer-events-none">
      <div className="glass-card rounded-2xl flex justify-between items-center p-1.5 shadow-2xl border-purple-500/20 pointer-events-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 outline-none ${
                isActive ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={22} className={`${isActive ? 'scale-110 shadow-purple-500/50' : 'scale-100'} transition-transform duration-300`} />
              <span className="text-[10px] mt-1 font-bold uppercase tracking-wider whitespace-nowrap">
                {item.label[locale]}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-0.5 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FooterMenu;
