import React, { useState } from 'react';
import { PMPlan, WorkOrder } from '../types';
import { Sliders, Clock, Wrench, CheckCircle2, AlertTriangle, Calendar, CheckSquare, User, DollarSign } from 'lucide-react';

interface PMPlanListProps {
  pmPlans: PMPlan[];
  workOrders: WorkOrder[];
  onUpdateWorkOrderStatus?: (id: string, newStatus: 'in_progress' | 'completed') => void;
}

export const PMPlanList: React.FC<PMPlanListProps> = ({ pmPlans, workOrders, onUpdateWorkOrderStatus }) => {
  const [localWorkOrders, setLocalWorkOrders] = useState<WorkOrder[]>(workOrders);

  const handleStatusToggle = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'in_progress' : 'completed';
    setLocalWorkOrders(prev => prev.map(w => w.id === id ? { ...w, status: nextStatus } : w));
    if (onUpdateWorkOrderStatus) {
      onUpdateWorkOrderStatus(id, nextStatus);
    }
  };

  const listToRender = localWorkOrders.length > 0 ? localWorkOrders : workOrders;

  return (
    <div className="space-y-8">
      
      {/* Active Work Orders Section */}
      <div className="space-y-4">
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Active Maintenance Work Orders (CM & PM)</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">({listToRender.length} Total Orders)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listToRender.map((wo) => (
            <div key={wo.id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    {wo.work_order_number}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    wo.status === 'in_progress'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : wo.status === 'completed'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {wo.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{wo.equipment_name}</h4>
                  <p className="text-xs text-slate-400 font-mono">Tag: {wo.equipment_code}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono my-3">
                  <div><span className="text-slate-500">Type:</span> {wo.maintenance_type}</div>
                  <div><span className="text-slate-500">Assigned:</span> {wo.assigned_to}</div>
                  <div><span className="text-slate-500">Est. Cost:</span> ${wo.estimated_cost?.toLocaleString()}</div>
                  <div><span className="text-slate-500">Started:</span> {new Date(wo.planned_start).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Status Action Button */}
              <button
                onClick={() => handleStatusToggle(wo.id, wo.status)}
                className={`w-full text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                  wo.status === 'completed'
                    ? 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{wo.status === 'completed' ? 'Re-open Work Order' : 'Mark Work Order Completed'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled PM Plans Section */}
      <div className="space-y-4">
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Preventive Maintenance Schedules (TBM / CBM / RCM)</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">({pmPlans.length} Strategies)</span>
        </div>

        <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Strategy</th>
                  <th className="p-3">Equipment</th>
                  <th className="p-3">Plan Name</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Last Execution</th>
                  <th className="p-3">Next Due</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {pmPlans.map((pm) => (
                  <tr key={pm.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pm.maintenance_strategy === 'CBM'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : pm.maintenance_strategy === 'RCM'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {pm.maintenance_strategy}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-white font-sans">
                      {pm.equipment_name}
                      <span className="block text-[10px] text-slate-400 font-mono">{pm.equipment_code}</span>
                    </td>
                    <td className="p-3 text-slate-200 font-sans">{pm.plan_name}</td>
                    <td className="p-3 text-slate-300">Every {pm.frequency} {pm.frequency_unit}</td>
                    <td className="p-3 text-slate-400">{pm.last_execution ? new Date(pm.last_execution).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-3 font-bold text-white">{new Date(pm.next_execution).toLocaleDateString()}</td>
                    <td className="p-3 text-center">
                      {pm.status === 'overdue' ? (
                        <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                          OVERDUE
                        </span>
                      ) : (
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          ACTIVE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
