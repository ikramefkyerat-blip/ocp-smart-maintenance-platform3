import React, { useState, useEffect } from 'react';
import { ParetoItem } from '../types';
import { BarChart2, PieChart, TrendingUp, Info, ShieldAlert, Award } from 'lucide-react';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';

interface ParetoAnalyticsProps {
  paretoData: ParetoItem[];
  onFetchPareto: (groupBy: 'equipment' | 'cause' | 'category') => void;
}

export const ParetoAnalytics: React.FC<ParetoAnalyticsProps> = ({ paretoData, onFetchPareto }) => {
  const [groupBy, setGroupBy] = useState<'equipment' | 'cause' | 'category'>('equipment');

  useEffect(() => {
    onFetchPareto(groupBy);
  }, [groupBy]);

  // Identify bad actors (items within 80% cumulative threshold)
  const badActors = paretoData.filter(item => item.cumulative_percentage <= 80.0 || paretoData.indexOf(item) === 0);

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Pareto Analysis (80/20 Reliability Principle)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify the vital few bad actors (20% of causes/equipment) that generate 80% of plant downtime and tonnage loss.
          </p>
        </div>

        {/* Grouping Selector */}
        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setGroupBy('equipment')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              groupBy === 'equipment' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bad Actor Assets
          </button>
          <button
            onClick={() => setGroupBy('cause')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              groupBy === 'cause' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Root Causes
          </button>
          <button
            onClick={() => setGroupBy('category')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              groupBy === 'category' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Failure Modes
          </button>
        </div>
      </div>

      {/* Bad Actor Banner Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold font-mono">
            80/20
          </div>
          <div>
            <span className="text-xs text-rose-300 font-semibold uppercase block">Top Bad Actor Focus</span>
            <p className="text-sm font-bold text-white">{badActors.map(b => b.label).join(', ') || 'None identified'}</p>
          </div>
        </div>

        <div className="bg-amber-950/40 border border-amber-900/60 rounded-xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold font-mono">
            {badActors.reduce((acc, i) => acc + i.total_downtime, 0)}h
          </div>
          <div>
            <span className="text-xs text-amber-300 font-semibold uppercase block">Vital Few Downtime Hours</span>
            <p className="text-sm font-bold text-white">Account for {badActors[badActors.length - 1]?.cumulative_percentage || 0}% of all plant downtime</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
            RCM
          </div>
          <div>
            <span className="text-xs text-emerald-400 font-semibold uppercase block">Recommended RCM Focus</span>
            <p className="text-xs text-slate-300">Prioritize CBM vibration monitoring on high-impact items above.</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Pareto Chart: Downtime Hours vs. Cumulative Impact %
          </h3>
          <span className="text-xs text-slate-400 font-mono">Red Line = 80% Vital Few Cutoff</span>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={paretoData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="label" 
                stroke="#94a3b8" 
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="#38bdf8" 
                tick={{ fontSize: 11 }}
                label={{ value: 'Downtime (Hours)', angle: -90, position: 'insideLeft', fill: '#38bdf8', fontSize: 11 }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#f43f5e" 
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                unit="%"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              
              {/* Bar: Downtime Hours */}
              <Bar yAxisId="left" dataKey="total_downtime" name="Downtime (Hours)" fill="#0284c7" radius={[6, 6, 0, 0]} />
              
              {/* Line: Cumulative Percentage */}
              <Line yAxisId="right" type="monotone" dataKey="cumulative_percentage" name="Cumulative %" stroke="#f43f5e" strokeWidth={3} dot={{ r: 5, fill: '#f43f5e' }} />
              
              {/* 80% Cutoff Line */}
              <ReferenceLine yAxisId="right" y={80} stroke="#e11d48" strokeDasharray="4 4" label={{ value: '80% Threshold', fill: '#f43f5e', fontSize: 11 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Pareto Frequency & Loss Distribution Table</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Item / Entity</th>
                <th className="p-3 text-right">Failure Count</th>
                <th className="p-3 text-right">Total Downtime (H)</th>
                <th className="p-3 text-right">Production Loss (Tons)</th>
                <th className="p-3 text-right">Pareto Share %</th>
                <th className="p-3 text-right">Cumulative %</th>
                <th className="p-3 text-center">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {paretoData.map((item, idx) => {
                const isBadActor = item.cumulative_percentage <= 80 || idx === 0;
                return (
                  <tr key={idx} className={`hover:bg-slate-800/40 transition-colors ${isBadActor ? 'bg-rose-950/10' : ''}`}>
                    <td className="p-3 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="p-3 font-semibold text-white font-sans">{item.label}</td>
                    <td className="p-3 text-right text-slate-200">{item.failure_count}</td>
                    <td className="p-3 text-right text-blue-400 font-bold">{item.total_downtime}h</td>
                    <td className="p-3 text-right text-rose-400 font-bold">{item.production_loss.toLocaleString()} T</td>
                    <td className="p-3 text-right text-slate-300">{item.percentage}%</td>
                    <td className="p-3 text-right font-bold text-rose-400">{item.cumulative_percentage}%</td>
                    <td className="p-3 text-center">
                      {isBadActor ? (
                        <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          VITAL FEW (P1)
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px]">
                          USEFUL MANY
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
