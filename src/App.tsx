import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { KPICards } from './components/KPICards';
import { EquipmentExplorer } from './components/EquipmentExplorer';
import { FailureReportModal } from './components/FailureReportModal';
import { ParetoAnalytics } from './components/ParetoAnalytics';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { NotificationCenter } from './components/NotificationCenter';
import { PMPlanList } from './components/PMPlanList';
import { AddEquipmentModal } from './components/AddEquipmentModal';
import { LoginPage } from './components/LoginPage';
import { SettingsPage } from './components/SettingsPage';
import { ImportExportModal } from './components/ImportExportModal';
import { 
  Equipment, 
  DashboardKPIs, 
  FailureHistory, 
  ParetoItem, 
  AppNotification, 
  WorkOrder, 
  PMPlan,
  User,
  UserRole
} from './types';
import { 
  Activity, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers, 
  BarChart2, 
  ShieldAlert,
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr-engineer',
    name: 'Ing. Fatima-Zahra Alami',
    email: 'fz.alami@ocpgroup.ma',
    role: 'maintenance_engineer',
    department: 'Condition Monitoring & RCM Unit',
    site: 'Jorf Lasfar Chemical Complex'
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'equipment' | 'failures' | 'pareto' | 'pm' | 'notifications' | 'settings'>('dashboard');
  
  // Data States
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [failures, setFailures] = useState<FailureHistory[]>([]);
  const [paretoData, setParetoData] = useState<ParetoItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [pmPlans, setPmPlans] = useState<PMPlan[]>([]);
  
  // UI States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isReportFailureOpen, setIsReportFailureOpen] = useState<boolean>(false);
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState<boolean>(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [copilotEquipment, setCopilotEquipment] = useState<Equipment | null>(null);
  const [reportEquipment, setReportEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch initial data from server
  const loadData = async () => {
    try {
      setIsLoading(true);

      const [eqRes, kpiRes, failRes, notifRes, woRes, pmRes] = await Promise.all([
        fetch('/api/equipment'),
        fetch('/api/dashboard/kpis'),
        fetch('/api/failures'),
        fetch('/api/notifications'),
        fetch('/api/workorders'),
        fetch('/api/pmplans')
      ]);

      if (eqRes.ok) setEquipmentList(await eqRes.json());
      if (kpiRes.ok) setKpis(await kpiRes.json());
      if (failRes.ok) setFailures(await failRes.json());
      if (notifRes.ok) setNotifications(await notifRes.json());
      if (woRes.ok) setWorkOrders(await woRes.json());
      if (pmRes.ok) setPmPlans(await pmRes.json());

      fetchPareto('equipment');
    } catch (err) {
      console.error('Failed to load OCP platform data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPareto = async (groupBy: 'equipment' | 'cause' | 'category') => {
    try {
      const res = await fetch(`/api/pareto?groupBy=${groupBy}`);
      if (res.ok) {
        setParetoData(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch pareto analysis:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleReportFailureSubmit = async (data: {
    equipment_id: string;
    category_name: string;
    cause_name: string;
    description: string;
    reported_by: string;
    downtime_hours: number;
    production_loss: number;
  }) => {
    try {
      const res = await fetch('/api/failures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error('Failed to submit failure:', err);
    }
  };

  const handleAddEquipmentSubmit = async (newEq: Partial<Equipment>) => {
    try {
      const res = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEq)
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error('Failed to add equipment:', err);
    }
  };

  // Batch Imports from Excel/CSV
  const handleImportEquipment = (imported: Partial<Equipment>[]) => {
    imported.forEach(eq => handleAddEquipmentSubmit(eq));
  };

  const handleImportFailures = (imported: Partial<FailureHistory>[]) => {
    imported.forEach(f => {
      const eq = equipmentList[0];
      handleReportFailureSubmit({
        equipment_id: eq ? eq.id : 'eq-1',
        category_name: f.category_name || 'Mechanical Failure',
        cause_name: f.cause_name || 'Imported Breakdown',
        description: f.description || 'Imported failure log',
        reported_by: f.reported_by || currentUser?.name || 'Shift Operator',
        downtime_hours: f.downtime_hours || 6,
        production_loss: f.production_loss || 1200
      });
    });
  };

  const handleMarkNotifRead = async (id?: string) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const notifRes = await fetch('/api/notifications');
      if (notifRes.ok) setNotifications(await notifRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearNotifs = async () => {
    try {
      await fetch('/api/notifications/clear', { method: 'POST' });
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateAlert = () => {
    const randomEq = equipmentList[Math.floor(Math.random() * equipmentList.length)] || equipmentList[0];
    const newAlert: AppNotification = {
      id: `sim-${Date.now()}`,
      title: `TELEMETRY ALARM: ${randomEq?.equipment_code || 'P-101'} Vibration Peak`,
      message: `Vibration sensor reading spiked to 7.8 mm/s RMS (Threshold: 4.5 mm/s RMS). Immediate inspection recommended.`,
      type: 'HEALTH_WARNING',
      priority: 'HIGH',
      color: '#f59e0b',
      is_read: false,
      created_at: new Date().toISOString(),
      equipment_id: randomEq?.id,
      equipment_code: randomEq?.equipment_code
    };

    setNotifications(prev => [newAlert, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // If user is logged out, show Login Portal
  if (!currentUser) {
    return <LoginPage onLogin={(usr) => setCurrentUser(usr)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        unreadCount={unreadCount}
        onOpenReportFailure={() => {
          setReportEquipment(null);
          setIsReportFailureOpen(true);
        }}
        onOpenAddEquipment={() => setIsAddEquipmentOpen(true)}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onToggleCopilot={() => {
          setCopilotEquipment(null);
          setIsCopilotOpen(!isCopilotOpen);
        }}
        isCopilotOpen={isCopilotOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRefresh={loadData}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Executive Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* KPI Overview Cards */}
            <KPICards
              kpis={kpis}
              onFilterStatus={(st) => {
                setActiveTab('equipment');
              }}
            />

            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Emergency Failure Dispatch Card */}
              <div className="bg-gradient-to-br from-rose-950/60 to-slate-900 border border-rose-900/60 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <h3 className="text-base font-bold text-white">Emergency Failure Log</h3>
                  </div>
                  <p className="text-xs text-rose-200/80 leading-relaxed">
                    Instantly report unscheduled breakdowns, auto-dispatch P1 emergency work orders to shift response teams, and recalculate fleet MTBF.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setReportEquipment(null);
                    setIsReportFailureOpen(true);
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-md shadow-rose-950 cursor-pointer transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Report Breakdown & Dispatch WO</span>
                </button>
              </div>

              {/* AI Copilot Intelligence Card */}
              <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-900/60 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">AI Reliability Copilot</h3>
                  </div>
                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    Powered by Gemini 3.6 Flash. Query live vibration telemetry, evaluate ISO 10816 standards, and generate RCM maintenance protocols.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCopilotEquipment(null);
                    setIsCopilotOpen(true);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-md shadow-emerald-950 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Copilot Assistant</span>
                </button>
              </div>

              {/* Excel Import / Export Card */}
              <div className="bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-900/60 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                    <h3 className="text-base font-bold text-white">Excel & CSV Import / Export</h3>
                  </div>
                  <p className="text-xs text-blue-200/80 leading-relaxed">
                    Batch upload equipment catalogs or historical failure logs from .xlsx / .csv spreadsheets and download formatted reports.
                  </p>
                </div>
                <button
                  onClick={() => setIsImportExportOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-md shadow-blue-950 cursor-pointer transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Open Excel / CSV Manager</span>
                </button>
              </div>

            </div>

            {/* Main Asset Directory Preview */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <span>Critical Assets Status Overview</span>
                </h3>
                <button
                  onClick={() => setActiveTab('equipment')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All Assets ({equipmentList.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <EquipmentExplorer
                equipmentList={equipmentList}
                onSelectEquipment={(eq) => {
                  setCopilotEquipment(eq);
                  setIsCopilotOpen(true);
                }}
                onOpenReportFailureFor={(eq) => {
                  setReportEquipment(eq);
                  setIsReportFailureOpen(true);
                }}
                onOpenCopilotFor={(eq) => {
                  setCopilotEquipment(eq);
                  setIsCopilotOpen(true);
                }}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        )}

        {/* Equipment View */}
        {activeTab === 'equipment' && (
          <EquipmentExplorer
            equipmentList={equipmentList}
            onSelectEquipment={(eq) => {
              setCopilotEquipment(eq);
              setIsCopilotOpen(true);
            }}
            onOpenReportFailureFor={(eq) => {
              setReportEquipment(eq);
              setIsReportFailureOpen(true);
            }}
            onOpenCopilotFor={(eq) => {
              setCopilotEquipment(eq);
              setIsCopilotOpen(true);
            }}
            searchQuery={searchQuery}
          />
        )}

        {/* Failures & Work Orders View */}
        {activeTab === 'failures' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Failure Logs & Emergency Work Orders</h2>
                <p className="text-xs text-slate-400">Complete historical breakdown records with downtime hours and production loss impact.</p>
              </div>
              <button
                onClick={() => {
                  setReportEquipment(null);
                  setIsReportFailureOpen(true);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer shadow-md shadow-rose-950"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Report Failure</span>
              </button>
            </div>

            <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Equipment</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Cause / Fault</th>
                      <th className="p-3">Reported By</th>
                      <th className="p-3 text-right">Downtime (H)</th>
                      <th className="p-3 text-right">Production Loss (Tons)</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {failures.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-semibold text-white font-sans">
                          {f.equipment_name}
                          <span className="block text-[10px] text-slate-400 font-mono">{f.equipment_code}</span>
                        </td>
                        <td className="p-3 font-sans text-slate-200">{f.category_name}</td>
                        <td className="p-3 text-rose-400 font-bold font-sans">{f.cause_name}</td>
                        <td className="p-3 text-slate-300 font-sans">{f.reported_by}</td>
                        <td className="p-3 text-right font-bold text-blue-400">{f.downtime_hours}h</td>
                        <td className="p-3 text-right font-bold text-rose-400">{f.production_loss?.toLocaleString()} T</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            f.verification_status === 'investigating'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {f.verification_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pareto Analytics View */}
        {activeTab === 'pareto' && (
          <ParetoAnalytics
            paretoData={paretoData}
            onFetchPareto={fetchPareto}
          />
        )}

        {/* PM & Work Orders View */}
        {activeTab === 'pm' && (
          <PMPlanList
            pmPlans={pmPlans}
            workOrders={workOrders}
          />
        )}

        {/* Notifications View */}
        {activeTab === 'notifications' && (
          <NotificationCenter
            notifications={notifications}
            onMarkRead={handleMarkNotifRead}
            onClearAll={handleClearNotifs}
            onTriggerSimulatedAlert={handleSimulateAlert}
          />
        )}

        {/* Settings View */}
        {activeTab === 'settings' && (
          <SettingsPage
            currentUser={currentUser}
            onUpdateUserRole={(newRole: UserRole) => {
              if (currentUser) {
                setCurrentUser({ ...currentUser, role: newRole });
              }
            }}
          />
        )}
      </main>

      {/* Slide-over AI Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        selectedEquipment={copilotEquipment}
      />

      {/* Failure Report Modal */}
      <FailureReportModal
        isOpen={isReportFailureOpen}
        onClose={() => setIsReportFailureOpen(false)}
        equipmentList={equipmentList}
        selectedEquipment={reportEquipment}
        onSubmitFailure={handleReportFailureSubmit}
      />

      {/* Add Equipment Modal */}
      <AddEquipmentModal
        isOpen={isAddEquipmentOpen}
        onClose={() => setIsAddEquipmentOpen(false)}
        onAddEquipment={handleAddEquipmentSubmit}
      />

      {/* Excel / CSV Import Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        equipmentList={equipmentList}
        failures={failures}
        workOrders={workOrders}
        onImportEquipment={handleImportEquipment}
        onImportFailures={handleImportFailures}
      />
    </div>
  );
}

export default App;
