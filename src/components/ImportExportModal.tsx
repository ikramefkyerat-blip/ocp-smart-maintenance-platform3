import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Equipment, FailureHistory, WorkOrder } from '../types';
import { Download, Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle, RefreshCw, FileText } from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  failures: FailureHistory[];
  workOrders: WorkOrder[];
  onImportEquipment: (imported: Partial<Equipment>[]) => void;
  onImportFailures: (imported: Partial<FailureHistory>[]) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  equipmentList,
  failures,
  workOrders,
  onImportEquipment,
  onImportFailures
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importType, setImportType] = useState<'equipment' | 'failures'>('equipment');
  const [importedPreview, setImportedPreview] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [importSuccessMsg, setImportSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  // Handle File Upload & Parsing using XLSX
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImportSuccessMsg('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setImportedPreview(data);
      } catch (err) {
        console.error('Error parsing Excel / CSV:', err);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Execute Import
  const handleConfirmImport = () => {
    if (importedPreview.length === 0) return;

    if (importType === 'equipment') {
      const formatted: Partial<Equipment>[] = importedPreview.map((row, idx) => ({
        name: row.name || row['Equipment Name'] || `Asset ${idx + 1}`,
        equipment_code: row.equipment_code || row['Equipment Code'] || row['Tag'] || `KHB-EQ-${100 + idx}`,
        manufacturer: row.manufacturer || row['Manufacturer'] || 'Industrial Spec',
        model: row.model || row['Model'] || 'Standard',
        type_name: row.type_name || row['Category'] || row['Type'] || 'General Equipment',
        area_name: row.area_name || row['Site'] || row['Complex'] || 'Khouribga Mining Complex',
        department_name: row.department_name || row['Department'] || 'Beneficiation Plant',
        criticality: (row.criticality || row['Criticality'] || 'HIGH').toUpperCase(),
        operating_status: (row.operating_status || row['Status'] || 'RUNNING').toUpperCase(),
        description: row.description || row['Description'] || 'Imported via Excel catalog.'
      }));
      onImportEquipment(formatted);
      setImportSuccessMsg(`Successfully imported ${formatted.length} equipment assets into database!`);
    } else {
      const formatted: Partial<FailureHistory>[] = importedPreview.map((row, idx) => ({
        equipment_name: row.equipment_name || row['Equipment Name'] || 'Plant Equipment',
        equipment_code: row.equipment_code || row['Tag'] || 'EQ-001',
        category_name: row.category_name || row['Failure Type'] || 'Mechanical Failure',
        cause_name: row.cause_name || row['Root Cause'] || 'Unscheduled Breakdown',
        reported_by: row.reported_by || row['Reported By'] || 'Shift Engineer',
        downtime_hours: Number(row.downtime_hours || row['Downtime (H)'] || 6),
        production_loss: Number(row.production_loss || row['Production Loss (Tons)'] || 1200),
        description: row.description || row['Details'] || 'Breakdown imported from logs.'
      }));
      onImportFailures(formatted);
      setImportSuccessMsg(`Successfully imported ${formatted.length} failure breakdown logs!`);
    }

    setImportedPreview([]);
  };

  // Export Data to Excel
  const handleExportData = (type: 'equipment' | 'failures' | 'workorders') => {
    let dataToExport: any[] = [];
    let filename = '';

    if (type === 'equipment') {
      filename = `OCP_Equipment_Catalog_${new Date().toISOString().split('T')[0]}.xlsx`;
      dataToExport = equipmentList.map(e => ({
        'Equipment Code': e.equipment_code,
        'Equipment Name': e.name,
        'Area / Complex': e.area_name,
        'Department': e.department_name,
        'Equipment Type': e.type_name,
        'Manufacturer': e.manufacturer,
        'Model': e.model,
        'Criticality': e.criticality,
        'Operating Status': e.operating_status,
        'MTBF (Hours)': e.mtbf_hours,
        'MTTR (Hours)': e.mttr_hours,
        'Availability %': e.availability_pct,
        'AI Health Index %': e.health_score,
        'Est. RUL (Hours)': e.rul_hours
      }));
    } else if (type === 'failures') {
      filename = `OCP_Failure_Breakdown_History_${new Date().toISOString().split('T')[0]}.xlsx`;
      dataToExport = failures.map(f => ({
        'Tag Code': f.equipment_code,
        'Equipment Name': f.equipment_name,
        'Failure Category': f.category_name,
        'Cause / Fault': f.cause_name,
        'Reported By': f.reported_by,
        'Downtime (Hours)': f.downtime_hours,
        'Production Loss (Tons)': f.production_loss,
        'Status': f.verification_status,
        'Date': new Date(f.start_time).toLocaleDateString()
      }));
    } else {
      filename = `OCP_Maintenance_Work_Orders_${new Date().toISOString().split('T')[0]}.xlsx`;
      dataToExport = workOrders.map(w => ({
        'WO Number': w.work_order_number,
        'Tag Code': w.equipment_code,
        'Equipment Name': w.equipment_name,
        'Assigned Technician': w.assigned_to,
        'Maintenance Type': w.maintenance_type,
        'Estimated Cost ($)': w.estimated_cost,
        'Status': w.status,
        'Planned Start': new Date(w.planned_start).toLocaleDateString()
      }));
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'OCP Export');
    XLSX.writeFile(wb, filename);
  };

  // Sample CSV Templates Download
  const downloadSampleTemplate = (type: 'equipment' | 'failures') => {
    let sampleData: any[] = [];
    let name = '';
    if (type === 'equipment') {
      name = 'OCP_Equipment_Import_Template.csv';
      sampleData = [
        {
          'Equipment Code': 'KHB-CMP-201',
          'Equipment Name': 'Main Air Compressor AC-201',
          'Manufacturer': 'Atlas Copco',
          'Model': 'ZR 250 VSD',
          'Type': 'Compressors',
          'Site': 'Khouribga Mining Complex',
          'Department': 'Instrument Air Utilities',
          'Criticality': 'HIGH',
          'Status': 'RUNNING',
          'Description': 'Multi-stage oil-free rotary screw compressor.'
        },
        {
          'Equipment Code': 'JLF-CRH-105',
          'Equipment Name': 'Primary Jaw Crusher JC-105',
          'Manufacturer': 'Metso Superior',
          'Model': 'C160 Jaw Crusher',
          'Type': 'Crushers',
          'Site': 'Jorf Lasfar Chemical Complex',
          'Department': 'Primary Rock Crushing',
          'Criticality': 'CRITICAL',
          'Status': 'RUNNING',
          'Description': 'Heavy duty jaw crusher for primary phosphate rock sizing.'
        }
      ];
    } else {
      name = 'OCP_Failures_Import_Template.csv';
      sampleData = [
        {
          'Tag': 'KHB-SLP-101',
          'Equipment Name': 'Phosphate Slurry Pump P-101',
          'Failure Type': 'Hydraulic & Wear Failure',
          'Root Cause': 'Gland Seal Leakage',
          'Reported By': 'Tech. Mehdi Tazi',
          'Downtime (H)': 8,
          'Production Loss (Tons)': 1600,
          'Details': 'Mechanical seal flush line blockage causing seal face overheating.'
        }
      ];
    }

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const csvStr = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Excel & CSV Data Import / Export</h3>
              <p className="text-xs text-slate-400">Manage plant equipment catalogs & historical maintenance records</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 space-x-2">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'export' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Reports (Excel .xlsx)</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'import' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Import Data (.xlsx / .csv)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6">
          
          {/* EXPORT TAB */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Generate formatted Excel reports (.xlsx) containing live fleet telemetry, equipment catalogs, breakdown logs, and work orders.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Equipment Catalog Export */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Catalog</span>
                    <h4 className="text-sm font-bold text-white">Equipment Assets</h4>
                    <p className="text-[11px] text-slate-400">{equipmentList.length} total assets with MTBF, MTTR, availability & AI scores.</p>
                  </div>
                  <button
                    onClick={() => handleExportData('equipment')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold text-xs py-2 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Excel</span>
                  </button>
                </div>

                {/* Failures Export */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">Breakdown Logs</span>
                    <h4 className="text-sm font-bold text-white">Failure History</h4>
                    <p className="text-[11px] text-slate-400">{failures.length} recorded failure incidents with downtime and tonnage loss.</p>
                  </div>
                  <button
                    onClick={() => handleExportData('failures')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 font-semibold text-xs py-2 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Excel</span>
                  </button>
                </div>

                {/* Work Orders Export */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">WO Management</span>
                    <h4 className="text-sm font-bold text-white">Work Orders</h4>
                    <p className="text-[11px] text-slate-400">{workOrders.length} active and completed work order dispatches.</p>
                  </div>
                  <button
                    onClick={() => handleExportData('workorders')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 font-semibold text-xs py-2 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Excel</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* IMPORT TAB */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              
              {/* Target Data Selector & Sample Download */}
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-slate-400 font-medium">Import Target:</span>
                  <button
                    onClick={() => {
                      setImportType('equipment');
                      setImportedPreview([]);
                      setImportSuccessMsg('');
                    }}
                    className={`px-3 py-1 rounded-md font-semibold ${
                      importType === 'equipment' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Equipment Catalog
                  </button>
                  <button
                    onClick={() => {
                      setImportType('failures');
                      setImportedPreview([]);
                      setImportSuccessMsg('');
                    }}
                    className={`px-3 py-1 rounded-md font-semibold ${
                      importType === 'failures' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Failure Logs
                  </button>
                </div>

                <button
                  onClick={() => downloadSampleTemplate(importType)}
                  className="text-xs text-emerald-400 hover:underline flex items-center space-x-1 font-mono"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download CSV Template</span>
                </button>
              </div>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-6 text-center space-y-3 bg-slate-950/40 transition-colors">
                <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                <div>
                  <label className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer inline-block transition-colors">
                    <span>Browse Excel / CSV File</span>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-2">Supports .xlsx, .xls, and .csv data spreadsheets</p>
                </div>
                {fileName && (
                  <p className="text-xs text-emerald-300 font-mono font-semibold">Loaded file: {fileName}</p>
                )}
              </div>

              {/* Import Success Notification */}
              {importSuccessMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-200 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{importSuccessMsg}</span>
                </div>
              )}

              {/* Data Preview Table */}
              {importedPreview.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Parsed Preview ({importedPreview.length} Rows Ready)</span>
                    <button
                      onClick={handleConfirmImport}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Batch Import</span>
                    </button>
                  </div>

                  <div className="max-h-48 overflow-auto rounded-lg border border-slate-800 bg-slate-950">
                    <table className="w-full text-left text-[11px] text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 font-mono uppercase sticky top-0">
                        <tr>
                          {Object.keys(importedPreview[0]).slice(0, 5).map((col, i) => (
                            <th key={i} className="p-2 border-b border-slate-800">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {importedPreview.slice(0, 5).map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).slice(0, 5).map((val: any, i) => (
                              <td key={i} className="p-2 truncate max-w-[120px]">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
