
import React, { useState, useEffect } from 'react';
import FoodInput from './components/FoodInput';
import NutritionalDashboard from './components/NutritionalDashboard';
import LogHistory from './components/LogHistory';
import { FoodNutrition, DailyGoal } from './types';
import { Settings, Apple } from 'lucide-react';

const DEFAULT_GOAL: DailyGoal = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 70,
};

const App: React.FC = () => {
  const [history, setHistory] = useState<FoodNutrition[]>([]);
  const [goal, setGoal] = useState<DailyGoal>(DEFAULT_GOAL);
  const [showSettings, setShowSettings] = useState(false);

  // Load state from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('nutri_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          // Only keep history from today
          const today = new Date().setHours(0,0,0,0);
          const filtered = parsed.filter((item: FoodNutrition) => item.timestamp >= today);
          setHistory(filtered);
        }
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }

    const savedGoal = localStorage.getItem('nutri_goal');
    if (savedGoal) {
      try {
        const parsedGoal = JSON.parse(savedGoal);
        setGoal({ ...DEFAULT_GOAL, ...parsedGoal });
      } catch (e) {
        console.error('Failed to load goal', e);
      }
    }
  }, []);

  // Save state to local storage
  useEffect(() => {
    localStorage.setItem('nutri_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('nutri_goal', JSON.stringify(goal));
  }, [goal]);

  const addFood = (food: FoodNutrition) => {
    setHistory(prev => [...prev, food]);
  };

  const removeFood = (id: string) => {
    setHistory(prev => prev.filter(f => f.id !== id));
  };

  const updateGoal = (key: keyof DailyGoal, val: string) => {
    const num = parseInt(val) || 0;
    setGoal(prev => ({ ...prev, [key]: num }));
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
              <Apple className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NutriScan AI
            </h1>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        {showSettings && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-in slide-in-from-top duration-300">
            <h2 className="text-lg font-semibold mb-4">Daily Nutritional Goals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(goal).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">{key}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => updateGoal(key as keyof DailyGoal, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <FoodInput onFoodAdded={addFood} />
        
        <NutritionalDashboard history={history} goal={goal} />

        <LogHistory history={history} onDelete={removeFood} />
      </main>

      <footer className="mt-16 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} NutriScan AI • Powered by Gemini</p>
      </footer>
    </div>
  );
};

export default App;
