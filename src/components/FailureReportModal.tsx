import React, { useState } from 'react';
import { Equipment } from '../types';
import { AlertTriangle, X, Wrench, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

interface FailureReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  selectedEquipment?: Equipment | null;
  onSubmitFailure: (data: {
    equipment_id: string;
    category_name: string;
    cause_name: string;
    description: string;
    reported_by: string;
    downtime_hours: number;
    production_loss: number;
  }) => Promise<void>;
}

export const FailureReportModal: React.FC<FailureReportModalProps> = ({
  isOpen,
  onClose,
  equipmentList,
  selectedEquipment,
  onSubmitFailure
}) => {
  const [equipmentId, setEquipmentId] = useState<string>(selectedEquipment?.id || (equipmentList[0]?.id || ''));
  const [categoryName, setCategoryName] = useState<string>('Mechanical Failure');
  const [causeName, setCauseName] = useState<string>('Gearbox Bearing Seizure');
  const [reportedBy, setReportedBy] = useState<string>('Ing. Shift Supervisor');
  const [downtimeHours, setDowntimeHours] = useState<number>(8);
  const [productionLoss, setProductionLoss] = useState<number>(2400);
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successInfo, setSuccessInfo] = useState<{ failureId: string; woNumber: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentId) return;

    setIsSubmitting(true);
    try {
      await onSubmitFailure({
        equipment_id: equipmentId,
        category_name: categoryName,
        cause_name: causeName,
        reported_by: reportedBy,
        downtime_hours: Number(downtimeHours),
        production_loss: Number(productionLoss),
        description: description || 'Unscheduled equipment outage reported on main plant line.'
      });
      
      setSuccessInfo({
        failureId: `FH-${Date.now().toString().slice(-6)}`,
        woNumber: `WO-2025-${Math.floor(Math.random() * 9000 + 1000)}`
      });

      setTimeout(() => {
        setSuccessInfo(null);
        setIsSubmitting(false);
        onClose();
      }, 2200);

    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="bg-rose-950/60 border-b border-rose-900/50 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-900">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Report Unscheduled Failure / Breakdown</h3>
              <p className="text-xs text-rose-300">Triggers Failure Log & Dispatches Emergency Work Order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation Toast Overlay */}
        {successInfo ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">Failure Logged & Emergency Work Order Dispatched</h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-1 inline-block text-left">
              <p className="text-slate-300"><span className="text-slate-500">Log Reference:</span> {successInfo.failureId}</p>
              <p className="text-emerald-400 font-bold"><span className="text-slate-500">Dispatched Work Order:</span> {successInfo.woNumber}</p>
              <p className="text-slate-300"><span className="text-slate-500">Equipment Status:</span> Set to BREAKDOWN</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Equipment Select */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-medium">Select Affected Equipment *</label>
              <select
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                {equipmentList.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    {eq.equipment_code} — {eq.name} ({eq.area_name})
                  </option>
                ))}
              </select>
            </div>

            {/* Category & Cause */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">Failure Category *</label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="Mechanical Failure">Mechanical Failure</option>
                  <option value="Electrical Failure">Electrical Failure</option>
                  <option value="Hydraulic & Wear Failure">Hydraulic & Wear Failure</option>
                  <option value="Instrumentation & Sensor Fault">Instrumentation & Sensor Fault</option>
                  <option value="Structural Integrity">Structural Integrity</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">Observed Cause / Fault *</label>
                <input
                  type="text"
                  value={causeName}
                  onChange={(e) => setCauseName(e.target.value)}
                  placeholder="e.g. Bearing Seizure, VFD Trip, Gland Leak"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Reported By & Impact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">Reported By *</label>
                <input
                  type="text"
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                  placeholder="Engineer / Tech Name"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">Est. Downtime (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={downtimeHours}
                  onChange={(e) => setDowntimeHours(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">Est. Production Loss (Tons)</label>
                <input
                  type="number"
                  value={productionLoss}
                  onChange={(e) => setProductionLoss(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Failure Description */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-medium">Failure Description & Observations</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe alarms, vibration levels, sound, smell, leakage or visual signs prior to trip..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                Submitting will change the equipment state to <strong className="text-rose-400">BREAKDOWN</strong>, issue an auto-generated P1 Work Order for the response team, and recalculate fleet MTBF/Availability.
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2 rounded-lg flex items-center space-x-2 shadow-lg shadow-rose-950 cursor-pointer disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{isSubmitting ? 'Logging & Dispatching...' : 'Submit Failure & Generate WO'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
