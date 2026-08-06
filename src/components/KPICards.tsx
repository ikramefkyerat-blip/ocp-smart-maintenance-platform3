import React from 'react';
import { DashboardKPIs } from '../types';
import { Activity, Clock, AlertOctagon, TrendingUp, Package, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface KPICardsProps {
  kpis: DashboardKPIs | null;
  onFilterStatus?: (status: string) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, onFilterStatus }) => {
  if (!kpis) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Availability */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fleet Availability</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">{kpis.availability_pct}%</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
              kpis.availability_pct >= 95 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              Target: 95.0%
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full ${kpis.availability_pct >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, kpis.availability_pct)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">Target operational uptime for OCP plants</p>
        </div>

        {/* MTBF */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">MTBF (Mean Time Between Failures)</span>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">{kpis.mtbf_hours} <span className="text-sm font-normal text-slate-400">Hours</span></span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> +12% MoM
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">Average continuous operating hours prior to failure</p>
        </div>

        {/* MTTR */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">MTTR (Mean Time To Repair)</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">{kpis.mttr_hours} <span className="text-sm font-normal text-slate-400">Hours</span></span>
            <span className="text-xs text-emerald-400 font-medium">-1.2h improvement</span>
          </div>
          <p className="mt-3 text-xs text-slate-400">Average response and wrench time per breakdown</p>
        </div>

        {/* Total Production Loss */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Production Loss</span>
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-rose-400">{kpis.total_production_loss.toLocaleString()} <span className="text-sm font-normal text-slate-400">Tons</span></span>
            <span className="text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
              {kpis.total_downtime_hours}h Downtime
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">Estimated phosphate tonnage unproduced due to outages</p>
        </div>
      </div>

      {/* Fleet Status Distribution Strip */}
      <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-slate-300">Fleet Status Overview</span>
          <span className="text-xs text-slate-400">({kpis.total_equipment} Total Assets Configured)</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onFilterStatus && onFilterStatus('RUNNING')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 hover:border-emerald-500 transition-colors text-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Running:</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">{kpis.running_equipment}</span>
          </button>

          <button
            onClick={() => onFilterStatus && onFilterStatus('STANDBY')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-slate-500 transition-colors text-xs cursor-pointer"
          >
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">Standby:</span>
            <span className="font-bold text-blue-400 font-mono text-sm">{kpis.standby_equipment}</span>
          </button>

          <button
            onClick={() => onFilterStatus && onFilterStatus('MAINTENANCE')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/50 hover:border-amber-500 transition-colors text-xs cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">Planned Maintenance:</span>
            <span className="font-bold text-amber-400 font-mono text-sm">{kpis.maintenance_equipment}</span>
          </button>

          <button
            onClick={() => onFilterStatus && onFilterStatus('BREAKDOWN')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/50 hover:border-rose-500 transition-colors text-xs cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="text-slate-300">Breakdown:</span>
            <span className="font-bold text-rose-400 font-mono text-sm">{kpis.breakdown_equipment}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
