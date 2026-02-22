import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './screens/Dashboard';
import SnapFridge from './screens/SnapFridge';
import Chat from './screens/Chat';
import Alerts from './screens/Alerts';
import Shopping from './screens/Shopping';
import { ThemeProvider } from './context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'snap':
        return <SnapFridge onComplete={() => setActiveTab('dashboard')} />;
      case 'chat':
        return <Chat />;
      case 'alerts':
        return <Alerts />;
      case 'shopping':
        return <Shopping />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 ml-64 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

