import React, { useState, useEffect } from 'react';
import AlertCard from '../components/AlertCard';
import { Alert, InventoryItem } from '../types';
import { Bell, RefreshCw } from 'lucide-react';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const items: InventoryItem[] = await res.json();
      
      const newAlerts: Alert[] = [];
      const today = new Date();

      items.forEach(item => {
        const expiry = new Date(item.expiry_date);
        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          newAlerts.push({
            id: `expired-${item.id}`,
            category: 'expired',
            message: `${item.name} expired on ${item.expiry_date}. You should probably discard it.`,
            itemId: item.id,
            itemName: item.name
          });
        } else if (diffDays <= 3) {
          newAlerts.push({
            id: `expiring-${item.id}`,
            category: 'expiring',
            message: `${item.name} is expiring in ${diffDays} days. Try using it in a recipe!`,
            itemId: item.id,
            itemName: item.name
          });
        }

        if (item.quantity < 1) {
          newAlerts.push({
            id: `low-${item.id}`,
            category: 'low_stock',
            message: `You're out of ${item.name}. Add it to your shopping list?`,
            itemId: item.id,
            itemName: item.name
          });
        }
      });

      setAlerts(newAlerts);
    } catch (error) {
      console.error("Failed to generate alerts", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateAlerts();
  }, []);

  const handleAction = (action: string, alert: Alert) => {
    console.log(`Action ${action} for alert ${alert.id}`);
    // Implement specific actions like "Add to List" or "View Recipe"
    if (action === 'Dismiss') {
      setAlerts(prev => prev.filter(a => a.id !== alert.id));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary-light dark:text-text-primary-dark tracking-tight">Alerts & Notifications</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">Stay on top of your kitchen inventory.</p>
        </div>
        <button 
          onClick={generateAlerts}
          className="p-3 bg-white dark:bg-card-dark border border-black/5 dark:border-white/10 rounded-2xl text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-all shadow-sm"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 bg-card-light dark:bg-card-dark rounded-2xl animate-pulse border border-black/5 dark:border-white/10" />
          ))}
        </div>
      ) : alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} onAction={handleAction} />
          ))}
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
