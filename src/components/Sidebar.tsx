import React from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  MessageCircle, 
  Bell, 
  ShoppingCart, 
  Sun, 
  Moon,
  Refrigerator
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'snap', label: 'Snap Fridge', icon: Camera },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart },
  ];

  return (
    <div className="w-64 h-screen bg-card-light dark:bg-card-dark border-r border-black/5 dark:border-white/10 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
          <Refrigerator size={24} />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary-light dark:text-text-primary-dark leading-none">FridgeAgent</h1>
          <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest mt-1">Smart Kitchen</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-black/5 dark:border-white/10">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span className="font-medium">Toggle Dark Mode</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
