import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, X, Loader2, Save } from 'lucide-react';
import { aiService } from '../services/ai';
import { motion, AnimatePresence } from 'motion/react';

interface SnapUploadProps {
  onResults: (results: any[]) => void;
}

const SnapUpload: React.FC<SnapUploadProps> = ({ onResults }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setPreview(reader.result as string);
      setIsUploading(true);

      try {
        const results = await aiService.parseFridgeImage(base64, file.type);
        onResults(results);
      } catch (error) {
        console.error("AI Parsing failed", error);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
          preview 
            ? 'border-primary bg-primary/5' 
            : 'border-black/10 dark:border-white/10 hover:border-primary hover:bg-primary/5'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 size={48} className="text-primary animate-spin" />
              <p className="font-display font-bold text-lg text-text-primary-light dark:text-text-primary-dark">AI is scanning your fridge...</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Identifying items and estimating expiry dates</p>
            </motion.div>
          ) : preview ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              <img src={preview} alt="Fridge preview" className="w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                  <Check size={32} />
                </div>
                <p className="font-bold text-text-primary-light dark:text-text-primary-dark">Scan Complete!</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                  className="text-sm text-danger font-bold hover:underline"
                >
                  Retake Photo
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center">
                <Camera size={40} />
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-xl text-text-primary-light dark:text-text-primary-dark">Snap your fridge</p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Upload a photo to automatically update your inventory</p>
              </div>
              <div className="flex gap-3 mt-2">
                <div className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-md shadow-primary/20 flex items-center gap-2">
                  <Upload size={16} />
                  Choose Image
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SnapUpload;
