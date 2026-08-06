import React, { useState } from 'react';
import { Equipment, Criticality, OperatingStatus } from '../types';
import { PlusCircle, X, Layers, CheckCircle2 } from 'lucide-react';

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEquipment: (newEq: Partial<Equipment>) => Promise<void>;
}

export const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  isOpen,
  onClose,
  onAddEquipment
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [areaName, setAreaName] = useState('Khouribga Mining Complex');
  const [departmentName, setDepartmentName] = useState('Washing & Beneficiation');
  const [typeName, setTypeName] = useState('Slurry Pumps');
  const [criticality, setCriticality] = useState<Criticality>('HIGH');
  const [status, setStatus] = useState<OperatingStatus>('RUNNING');
  const [manufacturer, setManufacturer] = useState('Warman / Weir');
  const [model, setModel] = useState('MCR-250');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddEquipment({
        name,
        equipment_code: code || `OCP-${Math.floor(Math.random() * 900 + 100)}`,
        area_name: areaName,
        department_name: departmentName,
        type_name: typeName,
        criticality,
        operating_status: status,
        manufacturer,
        model,
        description: description || 'New industrial asset registered into OCP fleet.',
        image_url: imageUrl
      });
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Register New Industrial Asset</h3>
              <p className="text-xs text-slate-400">Add equipment to OCP reliability telemetry network</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-slate-300 font-medium">Equipment Name *</label>
              <input
                type="text"
                placeholder="e.g. Hydrocyclone Battery HC-102"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-slate-300 font-medium">Asset Code / Tag *</label>
              <input
                type="text"
                placeholder="e.g. KHB-HC-102"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-slate-300 font-medium">Complex / Site</label>
              <select
                value={areaName}
                onChange={e => setAreaName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Khouribga Mining Complex">Khouribga Mining Complex</option>
                <option value="Jorf Lasfar Chemical Complex">Jorf Lasfar Chemical Complex</option>
                <option value="Safi Chemical Plant">Safi Chemical Plant</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300 font-medium">Criticality *</label>
              <select
                value={criticality}
                onChange={e => setCriticality(e.target.value as Criticality)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-slate-300 font-medium">Manufacturer</label>
              <input
                type="text"
                value={manufacturer}
                onChange={e => setManufacturer(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-slate-300 font-medium">Model / Spec</label>
              <input
                type="text"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-300 font-medium">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Technical description of equipment role in production..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
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
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-lg flex items-center space-x-2 shadow-lg shadow-emerald-950 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Asset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
