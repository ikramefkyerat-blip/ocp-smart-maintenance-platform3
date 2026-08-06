import React, { useState } from 'react';
import { AppNotification } from '../types';
import { ShieldAlert, Bell, Check, Trash2, Filter, Radio, AlertOctagon, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkRead: (id?: string) => void;
  onClearAll: () => void;
  onSelectEquipmentByCode?: (code: string) => void;
  onTriggerSimulatedAlert?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkRead,
  onClearAll,
  onSelectEquipmentByCode,
  onTriggerSimulatedAlert
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);

  const filtered = notifications.filter(n => {
    const matchesPriority = priorityFilter === 'all' || n.priority === priorityFilter;
    const matchesUnread = !unreadOnly || !n.is_read;
    return matchesPriority && matchesUnread;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center space-x-1 animate-pulse"><AlertOctagon className="w-3 h-3 mr-1 text-rose-400" /> CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center space-x-1"><AlertTriangle className="w-3 h-3 mr-1 text-amber-400" /> HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">LOW</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Reliability Notification & Alert Dispatch Center</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time automated alerts for critical trips, vibration thresholds, overdue PMs, and emergency work orders.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {onTriggerSimulatedAlert && (
            <button
              onClick={onTriggerSimulatedAlert}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer"
            >
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Simulate Telemetry Alert</span>
            </button>
          )}

          <button
            onClick={() => onMarkRead()}
            className="bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>

          <button
            onClick={onClearAll}
            className="bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Inbox</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="text-slate-400 font-semibold flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Priority:</span>
          </span>
          <div className="flex items-center space-x-1.5">
            {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-md uppercase font-mono text-[11px] cursor-pointer transition-colors ${
                  priorityFilter === p
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Show Unread Only ({notifications.filter(n => !n.is_read).length})</span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-slate-900/90 rounded-xl p-12 text-center border border-slate-800 text-slate-400 space-y-2">
            <Bell className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No Notifications Found</p>
            <p className="text-xs text-slate-500">All alerts have been cleared or read.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between ${
                !n.is_read
                  ? 'bg-slate-900 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800/80 opacity-80'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  n.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-emerald-400'
                }`}>
                  <Bell className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                    {getPriorityBadge(n.priority)}
                    {n.equipment_code && (
                      <button
                        onClick={() => onSelectEquipmentByCode && onSelectEquipmentByCode(n.equipment_code!)}
                        className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2 py-0.5 rounded border border-slate-700 cursor-pointer"
                      >
                        Tag: {n.equipment_code}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>

                  <span className="text-[10px] text-slate-400 font-mono block pt-1">
                    Received: {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => onMarkRead(n.id)}
                  className="text-xs text-slate-400 hover:text-emerald-400 p-1 rounded hover:bg-slate-800 cursor-pointer transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
