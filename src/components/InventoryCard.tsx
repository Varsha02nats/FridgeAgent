import React from 'react';
import { Plus, Minus, Edit2, Trash2, Calendar, Package } from 'lucide-react';
import { InventoryItem, ExpiryStatus } from '../types';
import { motion } from 'motion/react';

interface InventoryCardProps {
  item: InventoryItem;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ 
  item, 
  onIncrement, 
  onDecrement, 
  onEdit, 
  onDelete 
}) => {
  const getExpiryStatus = (expiryDate: string): ExpiryStatus => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 3) return 'expiring';
    return 'fresh';
  };

  const status = getExpiryStatus(item.expiry_date);
  const statusColors = {
    fresh: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    expiring: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const daysLeft = Math.ceil((new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card-light dark:bg-card-dark rounded-2xl p-5 border border-black/5 dark:border-white/10 lift-shadow group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg text-text-primary-light dark:text-text-primary-dark">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <Package size={14} />
            <span>{item.quantity} {item.unit}</span>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${statusColors[status]}`}>
          {status === 'fresh' ? `${daysLeft} days left` : status}
        </span>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center bg-bg-light dark:bg-bg-dark rounded-xl p-1">
          <button 
            onClick={() => onDecrement(item.id)}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-bold text-text-primary-light dark:text-text-primary-dark">{item.quantity}</span>
          <button 
            onClick={() => onIncrement(item.id)}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(item)}
            className="p-2 hover:bg-primary/10 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary rounded-xl transition-all"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-2 hover:bg-danger/10 text-text-secondary-light dark:text-text-secondary-dark hover:text-danger rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {item.notes && (
        <p className="mt-4 text-xs text-text-secondary-light dark:text-text-secondary-dark italic border-t border-black/5 dark:border-white/10 pt-3">
          "{item.notes}"
        </p>
      )}
    </motion.div>
  );
};

export default InventoryCard;
