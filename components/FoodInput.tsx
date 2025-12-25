
import React, { useState, useRef } from 'react';
import { Camera, Search, Loader2, X } from 'lucide-react';
import { analyzeFoodText, analyzeFoodImage } from '../services/geminiService';
import { FoodNutrition } from '../types';

interface Props {
  onFoodAdded: (food: FoodNutrition) => void;
}

const FoodInput: React.FC<Props> = ({ onFoodAdded }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeFoodText(query);
      onFoodAdded(result);
      setQuery('');
    } catch (err) {
      console.error(err);
      setError('Failed to analyze food. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const readFileAsBase64 = (file: File): Promise<{ base64: string; type: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve({ base64, type: file.type });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const { base64, type } = await readFileAsBase64(file);
      const result = await analyzeFoodImage(base64, type);
      onFoodAdded(result);
    } catch (err) {
      console.error(err);
      setError('Failed to recognize food from image. Please ensure the photo is clear.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <form onSubmit={handleTextSearch} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food (e.g., '1 slice of pizza', 'bowl of salad')"
            className="w-full pl-12 pr-24 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-700 outline-none"
            disabled={isLoading}
          />
          <div className="absolute left-4 text-gray-400">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </div>
          
          <div className="absolute right-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
              title="Upload Food Photo"
              disabled={isLoading}
            >
              <Camera className={`w-6 h-6 ${isLoading ? 'opacity-50' : ''}`} />
            </button>
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
        </form>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          capture="environment"
          className="hidden"
        />
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {['🍎 Apple', '🍳 Scrambled Eggs', '🥗 Greek Salad', '🍗 Chicken Breast'].map(item => (
          <button
            key={item}
            onClick={() => setQuery(item.split(' ')[1])}
            disabled={isLoading}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-full transition-colors disabled:opacity-50"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FoodInput;
