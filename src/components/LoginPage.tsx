import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, UserCheck, Wrench, Activity, Lock, ArrowRight, CheckCircle2, ChevronRight, KeyRound } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const PRESET_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Ing. Youssef El Mansouri',
    email: 'y.elmansouri@ocpgroup.ma',
    role: 'administrator',
    department: 'Reliability & Plant Systems Engineering',
    site: 'Khouribga & Jorf Lasfar Complexes'
  },
  {
    id: 'usr-engineer',
    name: 'Ing. Fatima-Zahra Alami',
    email: 'fz.alami@ocpgroup.ma',
    role: 'maintenance_engineer',
    department: 'Condition Monitoring & RCM Unit',
    site: 'Jorf Lasfar Chemical Complex'
  },
  {
    id: 'usr-tech',
    name: 'Tech. Mehdi Tazi',
    email: 'm.tazi@ocpgroup.ma',
    role: 'technician',
    department: 'Mechanical & Hydraulic Shift Response',
    site: 'Safi Chemical Plant'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('maintenance_engineer');
  const [emailInput, setEmailInput] = useState('fz.alami@ocpgroup.ma');
  const [passwordInput, setPasswordInput] = useState('••••••••');
  const [customName, setCustomName] = useState('OCP Operator');

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    const preset = PRESET_USERS.find(u => u.role === role);
    if (preset) {
      setEmailInput(preset.email);
      setCustomName(preset.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = PRESET_USERS.find(u => u.role === selectedRole);
    const userToLogin: User = {
      id: preset?.id || `usr-${Date.now()}`,
      name: customName || preset?.name || 'OCP User',
      email: emailInput || 'operator@ocpgroup.ma',
      role: selectedRole,
      department: preset?.department || 'Plant Operations',
      site: preset?.site || 'Khouribga Mining Complex'
    };
    onLogin(userToLogin);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Subtle Background Industrial Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10">
        
        {/* Left Branding Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-emerald-950/80 via-slate-950 to-slate-900 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50">
                <Activity className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-mono tracking-wider text-white">OCP GROUP</h1>
                <p className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">Smart Maintenance</p>
              </div>
            </div>

            <div className="space-y-4 my-8">
              <h2 className="text-2xl font-bold text-white leading-tight">
                Predictive Asset Reliability & Maintenance Portal
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Integrated IoT telemetry monitoring, vibration diagnostics (ISO 10816), MTBF/MTTR analytics, and Gemini AI maintenance copilot for phosphate mining complexes.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Real-Time Vibration & Sensor Monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>80/20 Pareto Bad Actor Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Gemini 3.6 AI Reliability Copilot</span>
            </div>
          </div>
        </div>

        {/* Right Authentication Panel */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white">Select Account Role to Sign In</h3>
              <p className="text-xs text-slate-400 mt-1">Choose a user profile role to access the platform with specific permissions.</p>
            </div>

            {/* Role Quick Selector Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              
              {/* Administrator */}
              <button
                type="button"
                onClick={() => handleSelectRole('administrator')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRole === 'administrator'
                    ? 'bg-purple-950/40 border-purple-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div>
                  <ShieldCheck className={`w-5 h-5 mb-2 ${selectedRole === 'administrator' ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold block truncate">Administrator</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-2 font-mono">Full Rights</span>
              </button>

              {/* Maintenance Engineer */}
              <button
                type="button"
                onClick={() => handleSelectRole('maintenance_engineer')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRole === 'maintenance_engineer'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div>
                  <UserCheck className={`w-5 h-5 mb-2 ${selectedRole === 'maintenance_engineer' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold block truncate">Engineer</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-2 font-mono">RCM & Analytics</span>
              </button>

              {/* Technician */}
              <button
                type="button"
                onClick={() => handleSelectRole('technician')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRole === 'technician'
                    ? 'bg-blue-950/40 border-blue-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div>
                  <Wrench className={`w-5 h-5 mb-2 ${selectedRole === 'technician' ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold block truncate">Technician</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-2 font-mono">Work Orders</span>
              </button>
            </div>

            {/* Selected Profile Badge Info */}
            {PRESET_USERS.find(u => u.role === selectedRole) && (
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 mb-5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">Active Demo Profile</span>
                  <p className="font-bold text-white">{PRESET_USERS.find(u => u.role === selectedRole)?.name}</p>
                  <p className="text-[11px] text-slate-400">{PRESET_USERS.find(u => u.role === selectedRole)?.department}</p>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300 font-mono border border-slate-700">
                  {selectedRole.toUpperCase()}
                </span>
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 cursor-pointer transition-colors pt-3"
              >
                <span>Enter OCP Smart Maintenance System</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-4">
            Office Chérifien des Phosphates • OCP Digital Transformation Unit • Security Level 4
          </div>
        </div>

      </div>
    </div>
  );
};
