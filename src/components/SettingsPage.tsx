import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Sliders, ShieldCheck, Database, Bell, Save, CheckCircle2, Building, Cpu, RefreshCw, Lock, Users } from 'lucide-react';

interface SettingsPageProps {
  currentUser: User | null;
  onUpdateUserRole?: (role: UserRole) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onUpdateUserRole }) => {
  // Site configuration state
  const [selectedComplex, setSelectedComplex] = useState('Khouribga Mining Complex');
  const [vibWarningThreshold, setVibWarningThreshold] = useState('4.5');
  const [vibCriticalThreshold, setVibCriticalThreshold] = useState('7.1');
  const [tempWarningThreshold, setTempWarningThreshold] = useState('75.0');
  const [tempCriticalThreshold, setTempCriticalThreshold] = useState('90.0');
  const [autoWorkOrderGen, setAutoWorkOrderGen] = useState(true);
  const [geminiModel, setGeminiModel] = useState('gemini-3.6-flash');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">System Settings & OCP Site Configuration</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure telemetry alarm thresholds, user role permissions, AI model settings, and site parameters.
          </p>
        </div>

        {currentUser && (
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-3 text-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold font-mono flex items-center justify-center border border-emerald-500/30">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <span className="font-bold text-white block">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Panel 1: Telemetry Sensor Alarm Thresholds */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">ISO 10816 Vibration & Thermal Alert Thresholds</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Vibration Warning (mm/s RMS)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vibWarningThreshold}
                  onChange={e => setVibWarningThreshold(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Vibration Critical Trip (mm/s RMS)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vibCriticalThreshold}
                  onChange={e => setVibCriticalThreshold(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-rose-400 font-bold font-mono focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Bearing Temperature Warning (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={tempWarningThreshold}
                  onChange={e => setTempWarningThreshold(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Bearing Temperature Trip (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={tempCriticalThreshold}
                  onChange={e => setTempCriticalThreshold(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-rose-400 font-bold font-mono focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoWorkOrderGen}
                  onChange={e => setAutoWorkOrderGen(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Auto-generate Emergency Work Orders on Critical Sensor Trips</span>
              </label>
            </div>
          </div>
        </div>

        {/* Panel 2: OCP Mining Site & AI Model Config */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Building className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Site & AI Intelligence Engine Setup</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Default Industrial Complex Site</label>
              <select
                value={selectedComplex}
                onChange={e => setSelectedComplex(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500 cursor-pointer"
              >
                <option value="Khouribga Mining Complex">Khouribga Mining Complex (Phosphate Extraction)</option>
                <option value="Jorf Lasfar Chemical Complex">Jorf Lasfar Chemical Complex (Fertilizers & Slurry Hub)</option>
                <option value="Safi Chemical Plant">Safi Chemical Plant (Phosphoric Acid)</option>
                <option value="Gantour Mining Site">Gantour Mining Site (Youssoufia / Benguerir)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Gemini AI Model Alias</label>
              <select
                value={geminiModel}
                onChange={e => setGeminiModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-emerald-500 cursor-pointer"
              >
                <option value="gemini-3.6-flash">gemini-3.6-flash (Recommended Speed & Reasoning)</option>
                <option value="gemini-3.1-pro">gemini-3.1-pro (Deep RCM Analysis)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">User Role Switcher (Active Session)</label>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {['administrator', 'maintenance_engineer', 'technician'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onUpdateUserRole && onUpdateUserRole(r as UserRole)}
                    className={`py-2 px-2 rounded-lg font-mono text-[11px] uppercase cursor-pointer border transition-colors ${
                      currentUser?.role === r
                        ? 'bg-emerald-600 text-white font-bold border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Role Permissions Matrix */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 space-y-3 md:col-span-2">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Role Access Control & Security Matrix</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Feature / Module</th>
                  <th className="p-2.5 text-center">Administrator</th>
                  <th className="p-2.5 text-center">Maintenance Engineer</th>
                  <th className="p-2.5 text-center">Technician</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                <tr>
                  <td className="p-2.5 font-sans font-semibold text-white">View Telemetry & Dashboard KPIs</td>
                  <td className="p-2.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-2.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-2.5 text-center text-emerald-400">Full Access</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans font-semibold text-white">Register / Edit Equipment Assets</td>
                  <td className="p-2.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-2.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-2.5 text-center text-slate-500">Read Only</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans font-semibold text-white">Report Failure & Dispatch Work Orders</td>
                  <td className="p-2.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-2.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-2.5 text-center text-emerald-400">Full Access</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans font-semibold text-white">Import / Export Excel & CSV Data</td>
                  <td className="p-2.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-2.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-2.5 text-center text-slate-500">Export Only</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans font-semibold text-white">Configure Site & Alarm Thresholds</td>
                  <td className="p-2.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-2.5 text-center text-slate-500">Read Only</td>
                  <td className="p-2.5 text-center text-slate-500">Restricted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Bar */}
        <div className="md:col-span-2 flex items-center justify-between bg-slate-900/90 rounded-xl p-4 border border-slate-800">
          {saveSuccess ? (
            <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>System settings saved successfully!</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Click save to persist configuration updates across active session.</span>
          )}

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-lg flex items-center space-x-2 shadow-lg shadow-emerald-950 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
};
