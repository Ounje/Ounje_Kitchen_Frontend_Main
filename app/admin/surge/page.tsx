"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";
import { Zap, Clock, Plus, Trash2, Save, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";

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

function fmt24(h: number) {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
}

interface SurgeSession {
  startedAt: string;
  endedAt: string | null;
  multiplier: number;
  reason: string;
  by: string;
}

function buildSessions(logs: LogEntry[], isCurrentlyActive: boolean): SurgeSession[] {
  const chronological = [...logs].reverse();
  const sessions: SurgeSession[] = [];
  let open: Partial<SurgeSession> | null = null;
  for (const log of chronological) {
    if (log.action === "activated") {
      if (open) sessions.push({ ...(open as SurgeSession), endedAt: null });
      open = { startedAt: log.at, multiplier: log.multiplier, reason: log.reason, by: log.by };
    } else if (log.action === "updated" && open) {
      open.multiplier = log.multiplier;
      if (log.reason) open.reason = log.reason;
    } else if (log.action === "deactivated" && open) {
      sessions.push({ ...(open as SurgeSession), endedAt: log.at });
      open = null;
    }
  }
  if (open && isCurrentlyActive) sessions.push({ ...(open as SurgeSession), endedAt: null });
  return sessions.reverse();
}

function fmtDuration(start: string, end: string | null): string {
  const diffMs = (end ? new Date(end).getTime() : Date.now()) - new Date(start).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "< 1m";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function MultiplierPill({ value }: { value: number }) {
  const cls =
    value >= 1.3 ? "bg-red-100 text-red-700 border-red-200"
    : value >= 1.2 ? "bg-orange-100 text-orange-700 border-orange-200"
    : "bg-green-100 text-green-700 border-green-200";
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold border ${cls}`}>{value.toFixed(1)}×</span>;
}

export default function AdminSurgePricingPage() {
  const [config, setConfig]         = useState<SurgeConfig | null>(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [saved, setSaved]           = useState(false);

  const [isActive, setIsActive]     = useState(false);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [reason, setReason]         = useState("");
  const [schedule, setSchedule]     = useState<ScheduleSlot[]>([]);
  const [dirty, setDirty]           = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(ENDPOINTS.SUPERADMIN.SURGE) as any;
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
    setSaved(false);
    try {
      const body = {
        isActive:   overrides?.isActive   ?? isActive,
        multiplier: overrides?.multiplier ?? multiplier,
        reason:     overrides?.reason     ?? reason,
        schedule:   overrides?.schedule   ?? schedule,
      };
      const res = await apiClient.put(ENDPOINTS.SUPERADMIN.SURGE, body) as any;
      const data: SurgeConfig = res?.data ?? res;
      setConfig(data);
      setIsActive(data.isActive);
      setMultiplier(data.multiplier ?? 1.0);
      setReason(data.reason ?? "");
      setSchedule(data.schedule ?? []);
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggle = () => save({ isActive: !isActive });

  const addSlot = () => {
    setSchedule(prev => [...prev, { label: "", days: [1,2,3,4,5], startHour: 12, endHour: 14, multiplier: 1.2, enabled: true }]);
    setDirty(true);
  };

  const removeSlot = (i: number) => { setSchedule(prev => prev.filter((_, idx) => idx !== i)); setDirty(true); };

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
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1a3f1c] border-t-transparent" />
      </div>
    );
  }

  const activeScheduledSlots = schedule.filter(s => s.enabled).length;
  const sessions = buildSessions(config?.logs ?? [], isActive);

  return (
    <div className="p-6 space-y-6 w-full">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#1a3f1c]" />
            Surge Pricing
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Control delivery fee multipliers in real-time</p>
        </div>
        <button type="button" onClick={load} title="Refresh"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> Changes saved successfully
        </div>
      )}

      {/* ── Live Control Card ───────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className={`px-6 py-4 flex items-center justify-between ${isActive ? "bg-amber-50 border-b border-amber-100" : "bg-gray-50 border-b border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-amber-400 animate-pulse" : "bg-gray-300"}`} />
            <span className={`font-bold text-base ${isActive ? "text-amber-700" : "text-gray-500"}`}>
              {isActive ? "Surge is ACTIVE" : "Surge is Inactive"}
            </span>
            {isActive && <MultiplierPill value={multiplier} />}
          </div>
          {isActive && config?.activatedBy && (
            <span className="text-xs text-gray-400">
              by {config.activatedBy}{config.activatedAt ? ` · ${fmtDate(config.activatedAt)}` : ""}
            </span>
          )}
          {!isActive && activeScheduledSlots > 0 && (
            <span className="text-xs text-gray-400">{activeScheduledSlots} schedule slot{activeScheduledSlots !== 1 ? "s" : ""} will auto-activate</span>
          )}
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggle}
                disabled={saving}
                aria-label="Toggle surge"
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-60
                  ${isActive ? "bg-[#1a3f1c]" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200
                  ${isActive ? "translate-x-6" : "translate-x-1"}`} />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {saving ? "Saving…" : isActive ? "Turn Off" : "Turn On"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Multiplier:</span>
              <div className="flex gap-1.5">
                {MULTIPLIERS.map(m => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => { setMultiplier(m); setDirty(true); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all
                      ${multiplier === m
                        ? m >= 1.3 ? "bg-red-500 text-white border-red-500 shadow-sm"
                          : m >= 1.2 ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                          : "bg-[#1a3f1c] text-white border-[#1a3f1c] shadow-sm"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {m.toFixed(1)}×
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-60">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Reason / Note
              </label>
              <input
                type="text"
                maxLength={200}
                placeholder="e.g. Heavy rain, Friday evening rush…"
                value={reason}
                onChange={e => { setReason(e.target.value); setDirty(true); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3f1c]/20 focus:border-[#1a3f1c]"
              />
            </div>
            {dirty && (
              <button
                type="button"
                onClick={() => save()}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1a3f1c] text-white font-semibold rounded-xl text-sm hover:bg-[#1a3f1c]/90 transition-colors disabled:opacity-60 shadow-sm"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving…" : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Peak Hours Schedule ─────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#1a3f1c]" />
            <div>
              <p className="font-semibold text-gray-900">Peak Hours Schedule</p>
              <p className="text-xs text-gray-400">Auto-activates surge during set times when manual toggle is off</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addSlot}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Slot
          </button>
        </div>

        <div className="p-6">
          {schedule.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
              No schedule configured — surge only activates via manual toggle
            </div>
          ) : (
            <div className="space-y-4">
              {schedule.map((slot, i) => (
                <div key={i} className={`border rounded-xl p-4 transition-all ${slot.enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"}`}>
                  <div className="flex items-start gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => updateSlot(i, { enabled: !slot.enabled })}
                      aria-label="Toggle slot"
                      className={`mt-1 relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors
                        ${slot.enabled ? "bg-[#1a3f1c]" : "bg-gray-200"}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform
                        ${slot.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>

                    <input
                      type="text"
                      placeholder="Label (e.g. Lunch Rush)"
                      value={slot.label}
                      onChange={e => updateSlot(i, { label: e.target.value })}
                      className="flex-1 min-w-40 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3f1c]/20 focus:border-[#1a3f1c]"
                    />

                    <div className="flex gap-1">
                      {MULTIPLIERS.map(m => (
                        <button
                          type="button"
                          key={m}
                          onClick={() => updateSlot(i, { multiplier: m })}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-all
                            ${slot.multiplier === m
                              ? m >= 1.3 ? "bg-red-500 text-white border-red-500"
                                : m >= 1.2 ? "bg-orange-500 text-white border-orange-500"
                                : "bg-[#1a3f1c] text-white border-[#1a3f1c]"
                              : "bg-white text-gray-400 border-gray-200"
                            }`}
                        >
                          {m.toFixed(1)}×
                        </button>
                      ))}
                    </div>

                    <button type="button" onClick={() => removeSlot(i)} aria-label="Remove slot" className="text-gray-300 hover:text-red-500 transition-colors ml-auto">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-4 flex-wrap">
                    <div className="flex gap-1">
                      {DAYS.map((d, idx) => (
                        <button
                          type="button"
                          key={d}
                          aria-label={d}
                          onClick={() => toggleSlotDay(i, idx)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
                            ${slot.days.includes(idx)
                              ? "bg-[#1a3f1c] text-white border-[#1a3f1c]"
                              : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <select
                        title="Start hour"
                        value={slot.startHour}
                        onChange={e => updateSlot(i, { startHour: Number(e.target.value) })}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-700 focus:outline-none"
                      >
                        {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{fmt24(h)}</option>)}
                      </select>
                      <span>to</span>
                      <select
                        title="End hour"
                        value={slot.endHour}
                        onChange={e => updateSlot(i, { endHour: Number(e.target.value) })}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-700 focus:outline-none"
                      >
                        {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{fmt24(h)}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {dirty && (
                <button
                  type="button"
                  onClick={() => save()}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1a3f1c] text-white font-semibold rounded-xl text-sm hover:bg-[#1a3f1c]/90 transition-colors disabled:opacity-60 shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving…" : "Save Schedule"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Surge Sessions ──────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Surge Sessions</p>
            <p className="text-xs text-gray-400 mt-0.5">Every time surge pricing was turned on and off</p>
          </div>
          {sessions.length > 0 && (
            <span className="text-xs text-gray-400">{sessions.length} session{sessions.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="py-16 text-center">
            <Zap className="h-8 w-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No surge sessions recorded yet</p>
            <p className="text-xs text-gray-300 mt-1">Sessions appear here once surge is activated for the first time</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Multiplier</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Reason</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Activated By</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Started</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Ended</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sessions.map((s, i) => (
                  <tr key={i} className={s.endedAt === null ? "bg-amber-50/60" : "hover:bg-gray-50/40 transition-colors"}>
                    <td className="px-6 py-3.5">
                      {s.endedAt === null ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          LIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                          Ended
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5"><MultiplierPill value={s.multiplier} /></td>
                    <td className="px-4 py-3.5 text-gray-500 max-w-48">
                      <span className="line-clamp-1">{s.reason || <span className="text-gray-300">—</span>}</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-gray-700 whitespace-nowrap">{s.by}</td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{fmtDate(s.startedAt)}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {s.endedAt
                        ? <span className="text-gray-400">{fmtDate(s.endedAt)}</span>
                        : <span className="text-amber-600 font-medium">Still active</span>}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs whitespace-nowrap">
                      {s.endedAt === null
                        ? <span className="text-amber-600 font-semibold">{fmtDuration(s.startedAt, null)}</span>
                        : <span className="text-gray-500">{fmtDuration(s.startedAt, s.endedAt)}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
