import React, { useState } from 'react';
import { Save, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import SnapUpload from '../components/SnapUpload';
import { motion, AnimatePresence } from 'motion/react';

const SnapFridge: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [results, setResults] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpdateResult = (index: number, field: string, value: any) => {
    const newResults = [...results];
    newResults[index][field] = value;
    setResults(newResults);
  };

  const handleRemoveResult = (index: number) => {
    setResults(results.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      for (const item of results) {
        await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }
      setShowSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error("Failed to save scanned items", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center">
        <h1 className="font-display font-bold text-3xl text-text-primary-light dark:text-text-primary-dark tracking-tight">Snap & Scan</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">Take a photo of your fridge to automatically identify items.</p>
      </div>

      <SnapUpload onResults={setResults} />

      <AnimatePresence>
        {results.length > 0 && !showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
              <h2 className="font-display font-bold text-xl text-text-primary-light dark:text-text-primary-dark">Review Scanned Items</h2>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{results.length} items detected</p>
            </div>

            <div className="grid gap-4">
              {results.map((item, idx) => (
                <motion.div 
                  key={idx}
                  layout
                  className="bg-card-light dark:bg-card-dark p-4 rounded-2xl border border-black/5 dark:border-white/10 flex flex-wrap md:flex-nowrap items-center gap-4"
                >
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] uppercase font-bold text-text-secondary-light dark:text-text-secondary-dark ml-1">Item Name</label>
                    <input 
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateResult(idx, 'name', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 font-bold text-text-primary-light dark:text-text-primary-dark p-0"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-[10px] uppercase font-bold text-text-secondary-light dark:text-text-secondary-dark ml-1">Qty</label>
                    <input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateResult(idx, 'quantity', parseFloat(e.target.value))}
                      className="w-full bg-transparent border-none focus:ring-0 font-bold text-text-primary-light dark:text-text-primary-dark p-0"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-[10px] uppercase font-bold text-text-secondary-light dark:text-text-secondary-dark ml-1">Unit</label>
                    <input 
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleUpdateResult(idx, 'unit', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 font-bold text-text-primary-light dark:text-text-primary-dark p-0"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-[10px] uppercase font-bold text-text-secondary-light dark:text-text-secondary-dark ml-1">Expiry Date</label>
                    <input 
                      type="date"
                      value={item.expiry_date}
                      onChange={(e) => handleUpdateResult(idx, 'expiry_date', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 font-bold text-text-primary-light dark:text-text-primary-dark p-0"
                    />
                  </div>
                  <button 
                    onClick={() => handleRemoveResult(idx)}
                    className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button 
                onClick={() => setResults([])}
                className="px-6 py-3 rounded-2xl font-bold text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save to Inventory'}
                <Save size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="font-display font-bold text-2xl text-text-primary-light dark:text-text-primary-dark">Inventory Updated!</h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">Returning to dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SnapFridge;
