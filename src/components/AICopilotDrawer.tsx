import React, { useState } from 'react';
import { Equipment } from '../types';
import { Sparkles, Send, X, Bot, ShieldCheck, Terminal, Cpu, RefreshCw, AlertTriangle } from 'lucide-react';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEquipment?: Equipment | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: string[];
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  selectedEquipment
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I am the **OCP AI Reliability & Predictive Maintenance Copilot**. 
I have real-time access to telemetry sensors, failure logs, ISO vibration diagnostics standards, and equipment MTBF/MTTR metrics.

${selectedEquipment ? `Currently analyzing **${selectedEquipment.equipment_code} (${selectedEquipment.name})**. Ask me anything!` : 'How can I assist your reliability engineering shift today?'}`
,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['OCP Reliability Engineering Ontology', 'ISO 10816 Diagnostics']
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          equipment_code: selectedEquipment?.equipment_code || undefined,
          context: selectedEquipment ? {
            name: selectedEquipment.name,
            code: selectedEquipment.equipment_code,
            status: selectedEquipment.operating_status,
            mtbf: selectedEquipment.mtbf_hours,
            mttr: selectedEquipment.mttr_hours,
            sensors: selectedEquipment.sensors
          } : undefined
        })
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'AI Copilot response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || ['OCP Equipment Knowledge Base']
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'Error connecting to AI Copilot service. Please ensure the backend is running.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetQueries = [
    `Analyze ${selectedEquipment?.equipment_code || 'CV-204'} vibration anomaly & RUL`,
    'Formulate Root Cause Analysis (RCA) for Slurry Pump seal leakage',
    'Generate 500H Preventive Maintenance Checklist',
    'What are top Pareto bad actors causing plant downtime?'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-200">
      
      {/* Drawer Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>OCP AI Reliability Copilot</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.2 rounded border border-emerald-500/30">Gemini 3.6</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {selectedEquipment ? `Focused on ${selectedEquipment.equipment_code}` : 'Fleet-Wide Predictive Maintenance Intelligence'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Preset Quick Actions */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800/80 overflow-x-auto">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Suggested Engineering Queries</span>
        <div className="flex space-x-2">
          {presetQueries.map((query, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(query)}
              disabled={isLoading}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.text}
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-700/60 text-[10px] text-slate-400 flex flex-wrap gap-1">
                  <span className="font-semibold text-emerald-400">Sources:</span>
                  {msg.sources.map((s, i) => (
                    <span key={i} className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-800">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-slate-950 p-3 rounded-xl border border-slate-800 w-fit">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Analyzing Telemetry & ISO vibration diagnostics...</span>
          </div>
        )}
      </div>

      {/* Drawer Input */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask AI Copilot for root cause, vibration analysis, or PM checklist..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
