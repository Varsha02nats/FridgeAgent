import React from 'react';
import { AlertTriangle, Clock, ShoppingBag, Info, ChevronRight, Leaf, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { Alert } from '../types';
import { motion } from 'motion/react';

interface AlertCardProps {
  alert: Alert;
  onAction: (actionType: string, itemId: number | undefined) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onAction }) => {
  const config = {
    expiring: {
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800/50',
      accent: 'border-l-4 border-l-yellow-500',
      buttons: ['Show Recipe', 'I Used It', 'Remind Me Tomorrow']
    },
    expired: {
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800/50',
      accent: 'border-l-4 border-l-red-500',
      buttons: ['Compost', 'Add to Shopping', 'Dismiss']
    },
    low_stock: {
      icon: ShoppingBag,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800/50',
      accent: 'border-l-4 border-l-blue-500',
      buttons: ['Add to Shopping List']
    },
    inactivity: {
      icon: Info,
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-200 dark:border-gray-800/50',
      accent: 'border-l-4 border-l-gray-500',
      buttons: ['Snap Fridge']
    }
  };

  const { icon: Icon, color, bg, border, accent, buttons } = config[alert.category];

  const getButtonIcon = (btn: string) => {
    if (btn === 'Compost') return <Leaf size={14} />;
    if (btn === 'Add to Shopping' || btn === 'Add to Shopping List') return <Plus size={14} />;
    if (btn === 'I Used It') return <CheckCircle2 size={14} />;
    if (btn === 'Dismiss') return <Trash2 size={14} />;
    return <ChevronRight size={14} />;
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`glass-dark ${accent} rounded-2xl p-6 flex flex-col md:flex-row gap-5 items-start transition-all duration-300 shadow-2xl hover:shadow-primary/5`}
    >
      <div className={`p-3.5 rounded-2xl bg-white/5 shadow-inner ${color} flex-shrink-0 border border-white/5`}>
        <Icon size={24} />
      </div>
      
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-display font-bold text-text-primary-dark capitalize flex items-center gap-2 tracking-tight">
              {alert.category.replace('_', ' ')}
              {alert.itemName && <span className="text-xs font-normal text-primary opacity-80">— {alert.itemName}</span>}
            </h4>
            <p className="text-sm text-text-primary-dark/90 mt-2 font-medium leading-relaxed">
              {alert.aiMessage || alert.message}
            </p>
          </div>
        </div>

        {alert.suggestions && alert.suggestions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {alert.suggestions.map((suggestion, idx) => (
              <span 
                key={idx} 
                className="text-[10px] px-2.5 py-1.5 bg-primary/10 rounded-lg text-primary border border-primary/20 font-bold uppercase tracking-wider"
              >
                💡 {suggestion}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-6">
          {buttons.map(btn => (
            <button
              key={btn}
              onClick={() => onAction(btn, alert.itemId)}
              className="px-5 py-2.5 bg-white/5 hover:bg-primary hover:text-white border border-white/10 rounded-xl text-xs font-bold text-text-primary-dark transition-all flex items-center gap-2 shadow-lg"
            >
              {getButtonIcon(btn)}
              {btn}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AlertCard;
