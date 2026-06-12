"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";
import { Zap, ZapOff, Clock, Plus, Trash2, Save, RefreshCw, AlertTriangle } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MULTIPLIERS = [1.0, 1.2, 1.3] as const;

interface ScheduleSlot {
  _id?: string;
  label: string;
  days: number[];
  startHour: number;
  endHour: number;
  multiplier: number;
  enabled: boolean;
}

interface LogEntry {
  action: string;
  multiplier: number;
  reason: string;
  by: string;
  at: string;
}

interface SurgeConfig {
  isActive: boolean;
  multiplier: number;
  reason: string;
  activatedBy: string;
  activatedAt: string | null;
  schedule: ScheduleSlot[];
  logs: LogEntry[];
}

function MultiplierBadge({ value }: { value: number }) {
  const colors =
    value >= 1.3
      ? "bg-red-500/20 text-red-300 border-red-500/30"
      : value >= 1.2
      ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${colors}`}>
      {value.toFixed(1)}×
    </span>
  );
}

function fmt24(h: number) {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function SurgePricingPage() {
  const [config, setConfig]       = useState<SurgeConfig | null>(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // local editable state
  const [isActive, setIsActive]       = useState(false);
  const [multiplier, setMultiplier]   = useState<number>(1.0);
  const [reason, setReason]           = useState("");
  const [schedule, setSchedule]       = useState<ScheduleSlot[]>([]);
  const [dirty, setDirty]             = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(ENDPOINTS.OPERATIONS.SURGE) as any;
      const data: SurgeConfig = res?.data ?? res;
      setConfig(data);
      setIsActive(data.isActive);
      setMultiplier(data.multiplier ?? 1.0);
      setReason(data.reason ?? "");
      setSchedule(data.schedule ?? []);
      setDirty(false);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load surge config");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (overrides?: Partial<{ isActive: boolean; multiplier: number; reason: string; schedule: ScheduleSlot[] }>) => {
    setSaving(true);
    setError(null);
    try {
      const body = {
        isActive:   overrides?.isActive   ?? isActive,
        multiplier: overrides?.multiplier ?? multiplier,
        reason:     overrides?.reason     ?? reason,
        schedule:   overrides?.schedule   ?? schedule,
      };
      const res = await apiClient.put(ENDPOINTS.OPERATIONS.SURGE, body) as any;
      const data: SurgeConfig = res?.data ?? res;
      setConfig(data);
      setIsActive(data.isActive);
      setMultiplier(data.multiplier ?? 1.0);
      setReason(data.reason ?? "");
      setSchedule(data.schedule ?? []);
      setDirty(false);
    } catch (e: any) {
      setError(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggle = () => {
    const next = !isActive;
    setIsActive(next);
    save({ isActive: next });
  };

  const addSlot = () => {
    setSchedule(prev => [...prev, { label: "", days: [1, 2, 3, 4, 5], startHour: 12, endHour: 14, multiplier: 1.2, enabled: true }]);
    setDirty(true);
  };

  const removeSlot = (i: number) => {
    setSchedule(prev => prev.filter((_, idx) => idx !== i));
    setDirty(true);
  };

  const updateSlot = (i: number, patch: Partial<ScheduleSlot>) => {
    setSchedule(prev => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s));
    setDirty(true);
  };

  const toggleSlotDay = (slotIdx: number, day: number) => {
    setSchedule(prev => prev.map((s, i) => {
      if (i !== slotIdx) return s;
      const days = s.days.includes(day) ? s.days.filter(d => d !== day) : [...s.days, day];
      return { ...s, days };
    }));
    setDirty(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#ffca3a] border-t-transparent" />
      </div>
    );
  }

  const activeScheduledSlots = schedule.filter(s => s.enabled).length;

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#ffca3a]" />
            Surge Pricing
          </h1>
          <p className="text-white/50 text-sm mt-1">Control delivery fee multipliers in real-time</p>
        </div>
        <button onClick={load} title="Refresh" className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Live Status + Toggle */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              disabled={saving}
              className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-60
                ${isActive ? "bg-[#ffca3a]" : "bg-white/20"}`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200
                ${isActive ? "translate-x-7" : "translate-x-1"}`} />
            </button>
            <div>
              <p className={`font-bold text-lg ${isActive ? "text-[#ffca3a]" : "text-white/50"}`}>
                {isActive ? "Surge ACTIVE" : "Surge Inactive"}
              </p>
              {isActive && config?.activatedBy && (
                <p className="text-white/40 text-xs">
                  Activated by {config.activatedBy}
                  {config.activatedAt ? ` · ${fmtDate(config.activatedAt)}` : ""}
                </p>
              )}
              {!isActive && activeScheduledSlots > 0 && (
                <p className="text-white/40 text-xs">{activeScheduledSlots} schedule slot{activeScheduledSlots !== 1 ? "s" : ""} active</p>
              )}
            </div>
          </div>

          {/* Multiplier selector */}
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-sm">Multiplier:</span>
            <div className="flex gap-1.5">
              {MULTIPLIERS.map(m => (
                <button
                  key={m}
                  onClick={() => { setMultiplier(m); setDirty(true); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all
                    ${multiplier === m
                      ? m >= 1.3 ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                        : m >= 1.2 ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                        : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-white/10 text-white/50 hover:bg-white/15"
                    }`}
                >
                  {m.toFixed(1)}×
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="mt-5 flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <label className="text-white/40 text-xs font-medium uppercase tracking-wider block mb-1.5">Reason / Note</label>
            <input
              type="text"
              maxLength={200}
              placeholder="e.g. Heavy rain, Friday evening rush…"
              value={reason}
              onChange={e => { setReason(e.target.value); setDirty(true); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#ffca3a]/50"
            />
          </div>
          {dirty && (
            <button
              onClick={() => save()}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#ffca3a] text-[#1a3f1c] font-bold rounded-xl text-sm hover:bg-[#ffca3a]/90 transition-colors disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save Changes"}
            </button>
          )}
        </div>
      </div>

      {/* Peak Hours Schedule */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#ffca3a]" />
            <div>
              <h2 className="text-white font-semibold">Peak Hours Schedule</h2>
              <p className="text-white/40 text-xs">Auto-activates surge during set times (when manual is off)</p>
            </div>
          </div>
          <button
            onClick={addSlot}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Slot
          </button>
        </div>

        {schedule.length === 0 ? (
          <div className="text-center py-8 text-white/30 text-sm border border-dashed border-white/10 rounded-xl">
            No schedule set — surge only activates manually
          </div>
        ) : (
          <div className="space-y-4">
            {schedule.map((slot, i) => (
              <div key={i} className={`border rounded-xl p-4 transition-colors ${slot.enabled ? "border-white/15 bg-white/3" : "border-white/8 bg-white/[0.02] opacity-60"}`}>
                <div className="flex items-start gap-3 flex-wrap">
                  {/* Enabled toggle */}
                  <button
                    onClick={() => { updateSlot(i, { enabled: !slot.enabled }); }}
                    className={`mt-0.5 relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors
                      ${slot.enabled ? "bg-[#ffca3a]" : "bg-white/20"}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform
                      ${slot.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>

                  {/* Label */}
                  <input
                    type="text"
                    placeholder="Label (e.g. Lunch Rush)"
                    value={slot.label}
                    onChange={e => updateSlot(i, { label: e.target.value })}
                    className="flex-1 min-w-[160px] bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#ffca3a]/40"
                  />

                  {/* Multiplier */}
                  <div className="flex gap-1">
                    {MULTIPLIERS.map(m => (
                      <button
                        key={m}
                        onClick={() => updateSlot(i, { multiplier: m })}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all
                          ${slot.multiplier === m
                            ? m >= 1.3 ? "bg-red-500 text-white" : m >= 1.2 ? "bg-orange-500 text-white" : "bg-emerald-500 text-white"
                            : "bg-white/10 text-white/50"
                          }`}
                      >
                        {m.toFixed(1)}×
                      </button>
                    ))}
                  </div>

                  <button onClick={() => removeSlot(i)} className="text-white/30 hover:text-red-400 transition-colors ml-auto">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Days + Hours */}
                <div className="mt-3 flex items-center gap-4 flex-wrap">
                  <div className="flex gap-1">
                    {DAYS.map((d, idx) => (
                      <button
                        key={d}
                        onClick={() => toggleSlotDay(i, idx)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all
                          ${slot.days.includes(idx) ? "bg-[#ffca3a] text-[#1a3f1c]" : "bg-white/10 text-white/40 hover:bg-white/15"}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <select
                      value={slot.startHour}
                      onChange={e => updateSlot(i, { startHour: Number(e.target.value) })}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                    >
                      {Array.from({ length: 24 }, (_, h) => (
                        <option key={h} value={h}>{fmt24(h)}</option>
                      ))}
                    </select>
                    <span>to</span>
                    <select
                      value={slot.endHour}
                      onChange={e => updateSlot(i, { endHour: Number(e.target.value) })}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                    >
                      {Array.from({ length: 24 }, (_, h) => (
                        <option key={h} value={h}>{fmt24(h)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {dirty && (
              <button
                onClick={() => save()}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#ffca3a] text-[#1a3f1c] font-bold rounded-xl text-sm hover:bg-[#ffca3a]/90 transition-colors disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving…" : "Save Schedule"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Activity Log */}
      {config?.logs && config.logs.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2.5">
            {config.logs.slice(0, 15).map((log, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className={`mt-0.5 shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold
                  ${log.action === "activated"   ? "bg-emerald-500/20 text-emerald-300"
                  : log.action === "deactivated" ? "bg-white/10 text-white/50"
                  : "bg-blue-500/20 text-blue-300"}`}>
                  {log.action}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-white/70">
                    <MultiplierBadge value={log.multiplier} />
                    {log.reason ? <span className="ml-1.5 text-white/50">"{log.reason}"</span> : null}
                  </span>
                  <span className="text-white/30 ml-2 text-xs">by {log.by}</span>
                </div>
                <span className="text-white/30 text-xs shrink-0">{fmtDate(log.at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
