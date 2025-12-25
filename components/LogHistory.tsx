
import React from 'react';
import { FoodNutrition } from '../types';
import { Trash2, Clock } from 'lucide-react';

interface Props {
  history: FoodNutrition[];
  onDelete: (id: string) => void;
}

const LogHistory: React.FC<Props> = ({ history = [], onDelete }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
        <p className="text-gray-400">No meals logged today. Start by searching or scanning!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        Recent Activity
        <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{history.length} items</span>
      </h3>
      <div className="grid gap-4">
        {[...history].reverse().map((food) => (
          <div key={food.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start hover:shadow-md transition-shadow">
            {food.image ? (
              <img src={food.image} alt={food.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl font-bold flex-shrink-0">
                {food.name ? food.name.charAt(0) : '?'}
              </div>
            )}
            
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-900 truncate">{food.name}</h4>
                <button 
                  onClick={() => onDelete(food.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(food.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="flex items-center gap-1">• {food.servingSize}</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <div className="text-[10px] text-emerald-600 font-bold uppercase">Cals</div>
                  <div className="text-sm font-bold text-emerald-900">{food.calories}</div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <div className="text-[10px] text-blue-600 font-bold uppercase">Prot</div>
                  <div className="text-sm font-bold text-blue-900">{food.protein}g</div>
                </div>
                <div className="bg-amber-50 p-2 rounded-lg">
                  <div className="text-[10px] text-amber-600 font-bold uppercase">Fat</div>
                  <div className="text-sm font-bold text-amber-900">{food.fat}g</div>
                </div>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <div className="text-[10px] text-purple-600 font-bold uppercase">Carb</div>
                  <div className="text-sm font-bold text-purple-900">{food.carbs}g</div>
                </div>
              </div>

              {food.additionalNutrients && food.additionalNutrients.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {food.additionalNutrients.slice(0, 3).map((n, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-gray-50 text-gray-500 rounded-md">
                      {n.name}: {n.amount}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogHistory;
