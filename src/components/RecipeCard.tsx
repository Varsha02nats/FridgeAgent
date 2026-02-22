import React, { useState } from 'react';
import { Clock, ChefHat, Check, Loader2, Sparkles } from 'lucide-react';
import { Recipe } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeCardProps {
  recipe: Recipe;
  onCook: (recipe: Recipe) => Promise<void>;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onCook }) => {
  const [isCooking, setIsCooking] = useState(false);
  const [cooked, setCooked] = useState(false);

  const handleCook = async () => {
    setIsCooking(true);
    try {
      await onCook(recipe);
      setCooked(true);
      setTimeout(() => setCooked(false), 3000);
    } finally {
      setIsCooking(false);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-dark rounded-2xl overflow-hidden lift-shadow group relative"
    >
      {recipe.isSmartChoice && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-lg shadow-primary/20">
            <Sparkles size={12} />
            SMART CHOICE
          </div>
        </div>
      )}

      <div className="h-32 bg-gradient-to-br from-primary/20 to-indigo-500/10 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/20" />
        <ChefHat size={48} className="text-white/20 relative z-10" />
        <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5">
          <Clock size={12} />
          {recipe.cook_time_minutes} MIN
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display font-bold text-lg text-text-primary-dark leading-tight group-hover:text-primary transition-colors">
            {recipe.name}
          </h3>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-text-secondary-dark uppercase tracking-widest">Ingredients</p>
          <div className="space-y-1.5">
            {recipe.ingredients.map((ing, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-text-primary-dark/80">{ing.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary-dark">{ing.amount_used} {ing.unit}</span>
                  {ing.pantry_remaining_after !== undefined && (
                    <span className="text-[10px] text-primary/60 font-medium">
                      (Left: {ing.pantry_remaining_after})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <button className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-text-primary-dark transition-all">
            View Recipe
          </button>
          <button 
            onClick={handleCook}
            disabled={isCooking || cooked}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
              cooked 
                ? 'bg-green-500 text-white shadow-green-500/20' 
                : 'bg-primary text-white shadow-primary/20 hover:bg-primary/90'
            }`}
          >
            {isCooking ? (
              <Loader2 size={16} className="animate-spin" />
            ) : cooked ? (
              <>
                <Check size={16} />
                COOKED!
              </>
            ) : (
              'I COOKED THIS!'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
