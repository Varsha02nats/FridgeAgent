import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { InventoryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => void;
  initialData?: InventoryItem | null;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    quantity: 1,
    unit: 'pcs',
    expiry_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        quantity: initialData.quantity,
        unit: initialData.unit,
        expiry_date: initialData.expiry_date,
        notes: initialData.notes
      });
    } else {
      setFormData({
        name: '',
        quantity: 1,
        unit: 'pcs',
        expiry_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-card-light dark:bg-card-dark rounded-3xl shadow-2xl overflow-hidden border border-black/5 dark:border-white/10"
        >
          <div className="p-6 border-b border-black/5 dark:border-white/10 flex justify-between items-center">
            <h2 className="font-display font-bold text-xl text-text-primary-light dark:text-text-primary-dark">
              {initialData ? 'Edit Item' : 'Add New Item'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-text-secondary-light dark:text-text-secondary-dark transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1 ml-1">Item Name</label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-bg-light dark:bg-bg-dark border border-black/5 dark:border-white/10 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="e.g. Whole Milk"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1 ml-1">Quantity</label>
                <input 
                  type="number"
                  required
                  step="0.1"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl bg-bg-light dark:bg-bg-dark border border-black/5 dark:border-white/10 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1 ml-1">Unit</label>
                <input 
                  type="text"
                  required
                  value={formData.unit}
                  onChange={e => setFormData({...formData, unit: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-bg-light dark:bg-bg-dark border border-black/5 dark:border-white/10 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="pcs, liters, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1 ml-1">Expiry Date</label>
              <input 
                type="date"
                required
                value={formData.expiry_date}
                onChange={e => setFormData({...formData, expiry_date: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-bg-light dark:bg-bg-dark border border-black/5 dark:border-white/10 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1 ml-1">Notes</label>
              <textarea 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-bg-light dark:bg-bg-dark border border-black/5 dark:border-white/10 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary outline-none transition-all h-24 resize-none"
                placeholder="Any special storage instructions..."
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Save size={20} />
              {initialData ? 'Update Item' : 'Save Item'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddItemModal;
