import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, Sparkles, Check } from 'lucide-react';
import { InventoryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const Shopping: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<{name: string, quantity: number, unit: string}[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setItems(data);
      
      // Auto-recommend items that are low or out of stock
      const lowStock = data.filter((i: InventoryItem) => i.quantity < 1).map((i: InventoryItem) => ({
        name: i.name,
        quantity: 1,
        unit: i.unit
      }));
      setShoppingList(lowStock);
    };
    fetchInventory();
  }, []);

  const addItem = () => {
    if (!newItem.trim()) return;
    setShoppingList([...shoppingList, { name: newItem, quantity: 1, unit: 'pcs' }]);
    setNewItem('');
  };

  const removeItem = (idx: number) => {
    setShoppingList(shoppingList.filter((_, i) => i !== idx));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <header>
          <h1 className="font-display font-bold text-3xl text-text-primary-light dark:text-text-primary-dark tracking-tight">Shopping List</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">Items you need to restock.</p>
        </header>

        <div className="bg-card-light dark:bg-card-dark rounded-3xl border border-black/5 dark:border-white/10 p-6 shadow-xl">
          <div className="flex gap-3 mb-6">
            <input 
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add item to list..."
              className="flex-1 px-4 py-3 rounded-xl bg-bg-light dark:bg-bg-dark border border-black/5 dark:border-white/10 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <button 
              onClick={addItem}
              className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {shoppingList.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-4 bg-bg-light dark:bg-bg-dark rounded-2xl border border-black/5 dark:border-white/10 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-primary rounded-md flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                      <Check size={14} className="text-primary opacity-0 group-hover:opacity-50" />
                    </div>
                    <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">{item.name}</span>
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">({item.quantity} {item.unit})</span>
                  </div>
                  <button 
                    onClick={() => removeItem(idx)}
                    className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {shoppingList.length === 0 && (
              <div className="text-center py-10 text-text-secondary-light dark:text-text-secondary-dark italic">
                Your shopping list is empty.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl border border-primary/20 p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Sparkles size={32} />
          </div>
          <h2 className="font-display font-bold text-2xl text-text-primary-light dark:text-text-primary-dark">AI Recommendations</h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2 mb-6">Based on your usage patterns and current inventory, I suggest buying these items soon.</p>
          
          <div className="w-full space-y-3">
            {['Eggs', 'Butter', 'Spinach'].map(item => (
              <div key={item} className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-2xl border border-black/5 dark:border-white/10">
                <span className="font-bold text-text-primary-light dark:text-text-primary-dark">{item}</span>
                <button 
                  onClick={() => setShoppingList([...shoppingList, { name: item, quantity: 1, unit: 'pcs' }])}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all"
                >
                  Add to List
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-3xl border border-black/5 dark:border-white/10 p-6">
          <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
            <ShoppingCart size={18} className="text-primary" />
            Inventory Lookup
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-2 border-b border-black/5 dark:border-white/10 last:border-0">
                <span className="text-text-primary-light dark:text-text-primary-dark">{item.name}</span>
                <span className={`font-mono ${item.quantity < 1 ? 'text-danger' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shopping;
