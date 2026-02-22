import React from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  MessageCircle, 
  Bell, 
  ShoppingCart, 
  Sun, 
  Moon,
  Refrigerator,
  ChefHat
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'snap', label: 'Snap Fridge', icon: Camera },
    { id: 'recipes', label: 'Smart Recipes', icon: ChefHat },
    { id: 'chat', label: 'Assistant', icon: MessageCircle },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart },
  ];

  return (
    <div className="w-64 h-screen glass-dark border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Refrigerator size={24} />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary-dark leading-none tracking-tight">FridgeAgent</h1>
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Premium AI</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative group ${
                isActive 
                  ? 'text-white' 
                  : 'text-text-secondary-dark hover:text-text-primary-dark'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-xl z-0"
                />
              )}
              <Icon size={20} className={`relative z-10 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
              <span className="font-bold text-sm relative z-10">{item.label}</span>
              {isActive && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-primary rounded-full shadow-lg shadow-primary/50" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary-dark hover:bg-white/5 transition-all"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span className="font-bold text-sm">Theme</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
