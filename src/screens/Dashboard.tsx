import React, { useState, useEffect } from 'react';
import { Plus, Camera, AlertCircle, Search } from 'lucide-react';
import InventoryCard from '../components/InventoryCard';
import AddItemModal from '../components/AddItemModal';
import { InventoryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const Dashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSave = async (itemData: Partial<InventoryItem>) => {
    const url = editingItem ? `/api/inventory/${editingItem.id}` : '/api/inventory';
    const method = editingItem ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      fetchInventory();
    } catch (error) {
      console.error("Failed to save item", error);
    }
  };

  const handleIncrement = async (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      await handleSave({ ...item, quantity: item.quantity + 1 });
    }
  };

  const handleDecrement = async (id: number) => {
    const item = items.find(i => i.id === id);
    if (item && item.quantity > 0) {
      await handleSave({ ...item, quantity: item.quantity - 1 });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
        fetchInventory();
      } catch (error) {
        console.error("Failed to delete item", error);
      }
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expiringSoon = items.filter(item => {
    const diff = Math.ceil((new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 3;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary-light dark:text-text-primary-dark tracking-tight">My Fridge</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">You have {items.length} items in your inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('snap')}
            className="px-5 py-3 bg-white dark:bg-card-dark border border-black/5 dark:border-white/10 rounded-2xl font-bold text-text-primary-light dark:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm"
          >
            <Camera size={20} />
            Snap Fridge
          </button>
          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="px-5 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>
      </header>

      {expiringSoon.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-danger/10 border border-danger/20 rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-danger text-white rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle size={24} />
          </div>
          <div className="flex-1">
            <p className="text-danger font-bold">Attention Needed!</p>
            <p className="text-sm text-danger/80">{expiringSoon.length} items are expiring within 3 days. Check them out!</p>
          </div>
          <button 
            onClick={() => onNavigate('alerts')}
            className="px-4 py-2 bg-danger text-white rounded-xl text-xs font-bold hover:bg-danger/90 transition-all"
          >
            View All
          </button>
        </motion.div>
      )}

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" size={20} />
        <input 
          type="text"
          placeholder="Search your inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card-light dark:bg-card-dark border border-black/5 dark:border-white/10 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-48 bg-card-light dark:bg-card-dark rounded-2xl animate-pulse border border-black/5 dark:border-white/10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map(item => (
              <InventoryCard 
                key={item.id}
                item={item}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-card-light dark:bg-card-dark rounded-3xl border border-dashed border-black/10 dark:border-white/10">
          <div className="w-20 h-20 bg-bg-light dark:bg-bg-dark rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary-light dark:text-text-secondary-dark">
            <Search size={32} />
          </div>
          <h3 className="font-display font-bold text-xl text-text-primary-light dark:text-text-primary-dark">No items found</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">Try a different search or add a new item.</p>
        </div>
      )}

      <AddItemModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSave={handleSave}
        initialData={editingItem}
      />
    </div>
  );
};

export default Dashboard;
