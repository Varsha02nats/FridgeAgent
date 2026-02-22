import React from 'react';
import { AlertTriangle, Clock, ShoppingBag, Info, ChevronRight } from 'lucide-react';
import { Alert } from '../types';
import { motion } from 'motion/react';

interface AlertCardProps {
  alert: Alert;
  onAction: (action: string, alert: Alert) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onAction }) => {
  const config = {
    expiring: {
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800/50',
      buttons: ['View Recipe', 'I Made This']
    },
    expired: {
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800/50',
      buttons: ['Dismiss']
    },
    low_stock: {
      icon: ShoppingBag,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800/50',
      buttons: ['Add to List']
    },
    inactivity: {
      icon: Info,
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-200 dark:border-gray-800/50',
      buttons: ['Snap Fridge']
    }
  };

  const { icon: Icon, color, bg, border, buttons } = config[alert.category];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${bg} ${border} border rounded-2xl p-5 flex gap-4 items-start`}
    >
      <div className={`p-3 rounded-xl bg-white dark:bg-card-dark shadow-sm ${color}`}>
        <Icon size={24} />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark capitalize">{alert.category.replace('_', ' ')}</h4>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">{alert.message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          {buttons.map(btn => (
            <button
              key={btn}
              onClick={() => onAction(btn, alert)}
              className="px-4 py-2 bg-white dark:bg-card-dark border border-black/5 dark:border-white/10 rounded-xl text-xs font-bold text-text-primary-light dark:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-2"
            >
              {btn}
              <ChevronRight size={14} />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AlertCard;
