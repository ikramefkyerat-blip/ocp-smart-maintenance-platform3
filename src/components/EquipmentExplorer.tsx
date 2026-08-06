import React, { useState } from 'react';
import { Equipment } from '../types';
import { 
  Layers, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Gauge, 
  Wrench, 
  Bot, 
  X, 
  ChevronRight, 
  Sliders, 
  Search,
  Building,
  Radio,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface EquipmentExplorerProps {
  equipmentList: Equipment[];
  onSelectEquipment: (eq: Equipment) => void;
  onOpenReportFailureFor: (eq: Equipment) => void;
  onOpenCopilotFor: (eq: Equipment) => void;
  searchQuery: string;
}

export const EquipmentExplorer: React.FC<EquipmentExplorerProps> = ({
  equipmentList,
  onSelectEquipment,
  onOpenReportFailureFor,
  onOpenCopilotFor,
  searchQuery
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeModalEq, setActiveModalEq] = useState<Equipment | null>(null);

  // Filter equipment
  const filtered = equipmentList.filter(eq => {
    const matchesSearch = 
      !searchQuery ||
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.equipment_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.type_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.area_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesArea = selectedArea === 'all' || eq.area_name?.toLowerCase().includes(selectedArea.toLowerCase());
    const matchesType = selectedType === 'all' || eq.type_name?.toLowerCase().includes(selectedType.toLowerCase());
    const matchesCriticality = selectedCriticality === 'all' || eq.criticality === selectedCriticality;
    const matchesStatus = selectedStatus === 'all' || eq.operating_status === selectedStatus;

    return matchesSearch && matchesArea && matchesType && matchesCriticality && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1"><CheckCircle2 className="w-3 h-3 mr-1" /> RUNNING</span>;
      case 'STANDBY':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">STANDBY</span>;
      case 'MAINTENANCE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center space-x-1"><Wrench className="w-3 h-3 mr-1" /> MAINTENANCE</span>;
      case 'BREAKDOWN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center space-x-1 animate-pulse"><AlertTriangle className="w-3 h-3 mr-1" /> BREAKDOWN</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">{status}</span>;
    }
  };

  const getCriticalityBadge = (criticality: string) => {
    switch (criticality) {
      case 'CRITICAL':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800">CRITICAL</span>;
      case 'HIGH':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800">HIGH</span>;
      case 'MEDIUM':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800">MEDIUM</span>;
      default:
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">LOW</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Control Bar & Filters */}
      <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold text-white">Asset Directory & Critical Equipment Hierarchy</h2>
            <span className="text-xs text-slate-400 font-mono">({filtered.length} matching)</span>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Area */}
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Sites / Complexes</option>
              <option value="khouribga">Khouribga Mining Complex</option>
              <option value="jorf">Jorf Lasfar Chemical Complex</option>
              <option value="safi">Safi Chemical Plant</option>
            </select>

            {/* Equipment Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Equipment Types</option>
              <option value="conveyor">Belt Conveyors</option>
              <option value="pump">Slurry Pumps</option>
              <option value="compressor">Compressors</option>
              <option value="crusher">Crushers & Mills</option>
              <option value="dryer">Rotary Dryers</option>
              <option value="reactor">Chemical Reactors</option>
            </select>

            {/* Criticality */}
            <select
              value={selectedCriticality}
              onChange={(e) => setSelectedCriticality(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Criticalities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>

            {/* Operating Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="RUNNING">RUNNING</option>
              <option value="STANDBY">STANDBY</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="BREAKDOWN">BREAKDOWN</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80 overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold text-[11px] shrink-0">Quick Asset Filter:</span>
          {[
            { label: 'All Assets', value: 'all' },
            { label: 'Belt Conveyors', value: 'conveyor' },
            { label: 'Slurry Pumps', value: 'pump' },
            { label: 'Compressors', value: 'compressor' },
            { label: 'Crushers & Mills', value: 'crusher' },
            { label: 'Dryers & Reactors', value: 'reactor' }
          ].map(chip => (
            <button
              key={chip.value}
              onClick={() => setSelectedType(chip.value)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                selectedType === chip.value
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((eq) => (
          <div
            key={eq.id}
            className={`bg-slate-900/90 rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between group ${
              eq.operating_status === 'BREAKDOWN'
                ? 'border-rose-700/80 shadow-lg shadow-rose-950/40'
                : 'border-slate-800 hover:border-slate-700 shadow-sm'
            }`}
          >
            <div>
              {/* Image & Header */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                <img
                  src={eq.image_url}
                  alt={eq.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  {getCriticalityBadge(eq.criticality)}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-700">
                    {eq.equipment_code}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  {getStatusBadge(eq.operating_status)}
                </div>

                <div className="absolute bottom-2 left-3 right-3">
                  <h3 className="text-base font-bold text-white truncate">{eq.name}</h3>
                  <p className="text-xs text-slate-300 truncate">{eq.area_name} • {eq.department_name}</p>
                </div>
              </div>

              {/* Specs & Health Metrics */}
              <div className="p-4 space-y-3">
                
                {/* Reliability Stats */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">MTBF</span>
                    <span className="text-sm font-bold font-mono text-white">{eq.mtbf_hours || 450}h</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">MTTR</span>
                    <span className="text-sm font-bold font-mono text-white">{eq.mttr_hours || 14}h</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Availability</span>
                    <span className={`text-sm font-bold font-mono ${
                      (eq.availability_pct || 96) >= 95 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {eq.availability_pct || 96.5}%
                    </span>
                  </div>
                </div>

                {/* AI RUL & Health Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>AI Health Index</span>
                    </span>
                    <span className="font-bold font-mono text-white">{eq.health_score || 85}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (eq.health_score || 85) >= 80
                          ? 'bg-emerald-500'
                          : (eq.health_score || 85) >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${eq.health_score || 85}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Est. RUL: {eq.rul_hours || 1200} Operating Hours</span>
                    <span>Fail Prob: {eq.failure_probability || 10}%</span>
                  </div>
                </div>

                {/* Sensors Preview */}
                {eq.sensors && eq.sensors.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Live Telemetry Sensors</span>
                    <div className="flex flex-wrap gap-1.5">
                      {eq.sensors.map(s => (
                        <div
                          key={s.id}
                          className={`text-[11px] font-mono px-2 py-0.5 rounded flex items-center space-x-1 ${
                            s.status === 'critical'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                              : s.status === 'warning'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <Radio className="w-2.5 h-2.5" />
                          <span>{s.sensor_code}: {s.current_reading} {s.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 pt-0 flex items-center space-x-2">
              <button
                onClick={() => setActiveModalEq(eq)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-700 transition-colors cursor-pointer text-center"
              >
                View Details
              </button>
              <button
                onClick={() => onOpenCopilotFor(eq)}
                className="bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 p-2 rounded-lg border border-emerald-800 transition-colors cursor-pointer"
                title="Ask AI Copilot Diagnosis"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenReportFailureFor(eq)}
                className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 p-2 rounded-lg border border-rose-800 transition-colors cursor-pointer"
                title="Report Failure for this Asset"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment Detailed Modal */}
      {activeModalEq && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-5 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-mono font-bold">
                  EQ
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{activeModalEq.name}</h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded">{activeModalEq.equipment_code}</span>
                    <span>• {activeModalEq.area_name}</span>
                    <span>• {activeModalEq.department_name}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModalEq(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Image & Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <img
                  src={activeModalEq.image_url}
                  alt={activeModalEq.name}
                  className="w-full h-44 object-cover rounded-xl border border-slate-800"
                />
                
                <div className="md:col-span-2 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(activeModalEq.operating_status)}
                    {getCriticalityBadge(activeModalEq.criticality)}
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      Type: {activeModalEq.type_name}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{activeModalEq.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                    <div><span className="text-slate-500">Manufacturer:</span> {activeModalEq.manufacturer}</div>
                    <div><span className="text-slate-500">Model:</span> {activeModalEq.model}</div>
                    <div><span className="text-slate-500">Serial No:</span> {activeModalEq.serial_number}</div>
                    <div><span className="text-slate-500">Commissioned:</span> {activeModalEq.commissioning_date}</div>
                  </div>
                </div>
              </div>

              {/* Reliability & AI Predictive Diagnostics */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Reliability Metrics & Predictive AI Diagnostics</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">MTBF</span>
                    <p className="text-lg font-bold font-mono text-white">{activeModalEq.mtbf_hours || 450} Hours</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">MTTR</span>
                    <p className="text-lg font-bold font-mono text-white">{activeModalEq.mttr_hours || 14} Hours</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Availability</span>
                    <p className={`text-lg font-bold font-mono ${
                      (activeModalEq.availability_pct || 96) >= 95 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {activeModalEq.availability_pct || 96.5}%
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Est. RUL</span>
                    <p className="text-lg font-bold font-mono text-emerald-400">{activeModalEq.rul_hours || 1200} Operating Hours</p>
                  </div>
                </div>
              </div>

              {/* Telemetry Sensors */}
              {activeModalEq.sensors && activeModalEq.sensors.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                    <Gauge className="w-4 h-4 text-blue-400" />
                    <span>Real-Time Telemetry Sensors</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeModalEq.sensors.map(s => (
                      <div key={s.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-400">{s.sensor_code}</span>
                          <span className={`w-2 h-2 rounded-full ${
                            s.status === 'critical' ? 'bg-rose-500 animate-ping' : s.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                        </div>
                        <p className="text-xl font-bold font-mono text-white">{s.current_reading} <span className="text-xs font-normal text-slate-400">{s.unit}</span></p>
                        <p className="text-[10px] text-slate-500">{s.sensor_type} • {s.manufacturer} {s.model}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Documents */}
              {activeModalEq.documents && activeModalEq.documents.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Attached Manuals & Engineering Drawings</span>
                  </h4>
                  <div className="space-y-2">
                    {activeModalEq.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          <span className="font-medium text-slate-200">{doc.title}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{doc.file_format}</span>
                        </div>
                        <a href="#" className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 font-medium">
                          <span>Download</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-4 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  const eq = activeModalEq;
                  setActiveModalEq(null);
                  onOpenCopilotFor(eq);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Copilot Diagnosis</span>
              </button>

              <button
                onClick={() => {
                  const eq = activeModalEq;
                  setActiveModalEq(null);
                  onOpenReportFailureFor(eq);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Report Breakdown / Failure</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
