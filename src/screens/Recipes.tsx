import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, ChefHat, Search, Loader2 } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { Recipe, InventoryItem } from '../types';
import { aiService } from '../services/ai';
import { motion, AnimatePresence } from 'motion/react';

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const items: InventoryItem[] = await res.json();
      const inventoryStr = items.map(i => `${i.name}: ${i.quantity} ${i.unit} (Expires: ${i.expiry_date})`).join(', ');
      
      const data = await aiService.generateRecipesFromPantry(inventoryStr);
      setRecipes(data);
    } catch (error) {
      console.error("Failed to fetch recipes", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleCook = async (recipe: Recipe) => {
    try {
      const res = await fetch('/api/inventory/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: recipe.ingredients })
      });
      const data = await res.json();
      
      if (data.success) {
        const results = data.results.map((r: any) => `${r.name} left: ${r.remaining} ${r.unit}`).join(', ');
        showToast(`Nice! Pantry updated. ${results}`);
      }
    } catch (error) {
      console.error("Failed to deduct ingredients", error);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="space-y-8 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary-dark tracking-tight flex items-center gap-3">
            Smart Recipes
            <Sparkles className="text-primary" size={24} />
          </h1>
          <p className="text-text-secondary-dark mt-1">Intelligent meal ideas based on your current pantry.</p>
        </div>
        <button 
          onClick={fetchRecipes}
          disabled={isLoading}
          className="px-5 py-3 glass-dark rounded-2xl font-bold text-text-primary-dark hover:bg-white/10 transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
          Refresh Ideas
        </button>
      </header>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 z-50 glass-dark px-6 py-4 rounded-2xl font-medium shadow-2xl text-text-primary-dark border border-primary/30 max-w-md"
          >
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
                <ChefHat size={18} />
              </div>
              <p className="text-sm leading-relaxed">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-80 glass-dark rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {recipes.map((recipe, idx) => (
              <RecipeCard key={idx} recipe={recipe} onCook={handleCook} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 glass-dark rounded-3xl border border-dashed border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary-dark">
            <Search size={32} />
          </div>
          <h3 className="font-display font-bold text-xl text-text-primary-dark">No recipes found</h3>
          <p className="text-text-secondary-dark mt-1">Try adding more items to your pantry first.</p>
        </div>
      )}
    </div>
  );
};

export default Recipes;
