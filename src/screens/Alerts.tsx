import React, { useState, useEffect } from 'react';
import AlertCard from '../components/AlertCard';
import { Alert, InventoryItem } from '../types';
import { Bell, RefreshCw, Sparkles, Leaf } from 'lucide-react';
import { aiService } from '../services/ai';
import { motion, AnimatePresence } from 'motion/react';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBadge, setShowBadge] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const generateAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const items: InventoryItem[] = await res.json();
      
      const baseAlerts: Alert[] = [];
      const today = new Date();

      items.forEach(item => {
        const expiry = new Date(item.expiry_date);
        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          baseAlerts.push({
            id: `expired-${item.id}`,
            category: 'expired',
            message: `${item.name} expired on ${item.expiry_date}.`,
            itemId: item.id,
            itemName: item.name
          });
        } else if (diffDays <= 3) {
          baseAlerts.push({
            id: `expiring-${item.id}`,
            category: 'expiring',
            message: `${item.name} is expiring in ${diffDays} days.`,
            itemId: item.id,
            itemName: item.name
          });
        }

        if (item.quantity < 1) {
          baseAlerts.push({
            id: `low-${item.id}`,
            category: 'low_stock',
            message: `You're out of ${item.name}.`,
            itemId: item.id,
            itemName: item.name
          });
        }
      });

      // Enrich with AI messages in parallel
      const enrichedAlerts = await Promise.all(baseAlerts.map(async (alert) => {
        const item = items.find(i => i.id === alert.itemId);
        if (item) {
          const diffDays = Math.ceil((new Date(item.expiry_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const aiData = await aiService.generateAlertMessage(item.name, diffDays, alert.category);
          return { ...alert, aiMessage: aiData.message, suggestions: aiData.suggestions };
        }
        return alert;
      }));

      setAlerts(enrichedAlerts);
    } catch (error) {
      console.error("Failed to generate alerts", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateAlerts();
  }, []);

  const handleAction = async (action: string, itemId: number | undefined) => {
    if (!itemId) return;

    if (action === 'I Used It') {
      try {
        const res = await fetch('/api/inventory');
        const items: InventoryItem[] = await res.json();
        const item = items.find(i => i.id === itemId);
        if (item) {
          await fetch(`/api/inventory/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: Math.max(0, item.quantity - 1) })
          });
          setAlerts(prev => prev.filter(a => a.itemId !== itemId));
          showToast('Updated inventory! 🍳');
        }
      } catch (e) {
        console.error(e);
      }
    } else if (action === 'Compost') {
      try {
        await fetch(`/api/inventory/${itemId}`, { method: 'DELETE' });
        setAlerts(prev => prev.filter(a => a.itemId !== itemId));
        setShowBadge('Zero Waste Hero 🌱');
        setTimeout(() => setShowBadge(null), 3000);
      } catch (e) {
        console.error(e);
      }
    } else if (action === 'Add to Shopping' || action === 'Add to Shopping List') {
      showToast('Added to shopping list! 🛒');
      // In a real app, we'd persist this to a shopping list table
    } else if (action === 'Dismiss') {
      setAlerts(prev => prev.filter(a => a.itemId !== itemId));
    } else if (action === 'Remind Me Tomorrow') {
      setAlerts(prev => prev.filter(a => a.itemId !== itemId));
      showToast('Will remind you tomorrow! ⏰');
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary-light dark:text-text-primary-dark tracking-tight flex items-center gap-3">
            Smart Alerts
            <Sparkles className="text-primary" size={24} />
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">AI-powered insights for your kitchen.</p>
        </div>
        <button 
          onClick={generateAlerts}
          className="p-3 bg-white dark:bg-card-dark border border-black/5 dark:border-white/10 rounded-2xl text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-all shadow-sm"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </header>

      <AnimatePresence>
        {showBadge && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
          >
            <Leaf size={20} />
            {showBadge}
          </motion.div>
        )}

        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 z-50 bg-card-light dark:bg-card-dark border border-black/5 dark:border-white/10 px-6 py-3 rounded-2xl font-bold shadow-xl text-text-primary-light dark:text-text-primary-dark"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-40 bg-card-light dark:bg-card-dark rounded-2xl animate-pulse border border-black/5 dark:border-white/10" />
          ))}
        </div>
      ) : alerts.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} onAction={handleAction} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-card-light dark:bg-card-dark rounded-3xl border border-dashed border-black/10 dark:border-white/10">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={32} />
          </div>
          <h3 className="font-display font-bold text-xl text-text-primary-light dark:text-text-primary-dark">All clear!</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">No urgent alerts for your fridge right now.</p>
        </div>
      )}
    </div>
  );
};

export default Alerts;
