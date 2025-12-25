
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FoodNutrition, DailyGoal } from '../types';

interface Props {
  history: FoodNutrition[];
  goal: DailyGoal;
}

const NutritionalDashboard: React.FC<Props> = ({ history, goal }) => {
  const totals = history.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fat: acc.fat + item.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const chartData = [
    { name: 'Protein', value: totals.protein * 4, color: '#10b981' }, // 4 cal/g
    { name: 'Carbs', value: totals.carbs * 4, color: '#3b82f6' },    // 4 cal/g
    { name: 'Fat', value: totals.fat * 9, color: '#f59e0b' },      // 9 cal/g
  ];

  const calProgress = Math.min((totals.calories / goal.calories) * 100, 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Progress</h2>
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-bold text-gray-900">{totals.calories.toFixed(0)}</span>
              <span className="text-gray-500 font-medium">/ {goal.calories} kcal</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className="bg-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${calProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <MacroProgress label="Protein" current={totals.protein} goal={goal.protein} color="bg-emerald-500" unit="g" />
            <MacroProgress label="Carbs" current={totals.carbs} goal={goal.carbs} color="bg-blue-500" unit="g" />
            <MacroProgress label="Fat" current={totals.fat} goal={goal.fat} color="bg-amber-500" unit="g" />
          </div>
        </div>

        <div className="h-64 flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Calorie Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {chartData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs font-medium text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MacroProgress: React.FC<{ label: string; current: number; goal: number; color: string; unit: string }> = ({ label, current, goal, color, unit }) => (
  <div>
    <div className="text-xs font-semibold text-gray-500 mb-1">{label}</div>
    <div className="text-sm font-bold text-gray-900 mb-1">{current.toFixed(1)}{unit}</div>
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div 
        className={`${color} h-1.5 rounded-full`}
        style={{ width: `${Math.min((current / goal) * 100, 100)}%` }}
      ></div>
    </div>
    <div className="text-[10px] text-gray-400 mt-1">Goal: {goal}{unit}</div>
  </div>
);

export default NutritionalDashboard;
