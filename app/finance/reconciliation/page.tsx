'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, ChevronDown, ChevronRight, RefreshCw, Clock } from 'lucide-react';
import financeService, {
  type ReconciliationReport,
  type ReconciliationHistoryItem,
  type ReconciliationCheckSummary,
} from '@/lib/api/services/finance.service';

// ── Severity config ───────────────────────────────────────────────────────────
const SEV = {
  critical: { color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    icon: ShieldAlert,    label: 'Critical' },
  warning:  { color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200',  icon: AlertTriangle,  label: 'Warning'  },
  info:     { color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   icon: Info,           label: 'Info'     },
};

// ── Summary badge ─────────────────────────────────────────────────────────────
function SummaryBadge({ count, type }: { count: number; type: keyof typeof SEV }) {
  if (!count) return null;
  const cfg = SEV[type];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      {count} {cfg.label}
    </span>
  );
}

// ── Check row ─────────────────────────────────────────────────────────────────
function CheckRow({ check }: { check: ReconciliationCheckSummary }) {
  const [open, setOpen] = useState(false);
  const cfg = SEV[check.severity];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-xl border overflow-hidden ${check.count > 0 ? cfg.border : 'border-gray-100'}`}>
      <button type="button" onClick={() => check.count > 0 && setOpen(o => !o)}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
          check.count > 0 ? `${cfg.bg} hover:opacity-90` : 'bg-gray-50'
        }`}>
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 shrink-0 ${check.count > 0 ? cfg.color : 'text-gray-400'}`} />
          <span className={`text-sm font-semibold ${check.count > 0 ? cfg.color : 'text-gray-500'}`}>
            {check.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-black ${check.count > 0 ? cfg.color : 'text-gray-400'}`}>
            {check.count} {check.count === 1 ? 'issue' : 'issues'}
          </span>
          {check.count > 0 && (
            open ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>
      {open && check.items.length > 0 && (
        <div className="border-t border-gray-100 bg-white p-4 overflow-x-auto">
          <pre className="text-xs text-gray-600 whitespace-pre-wrap">
            {JSON.stringify(check.items, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ── History row ───────────────────────────────────────────────────────────────
function HistoryRow({ item, onSelect }: { item: ReconciliationHistoryItem; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        {item.clean
          ? <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
          : <ShieldAlert  className="w-4 h-4 text-red-500  shrink-0" />}
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {new Date(item.runAt).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {item.triggeredBy} · {item.durationMs ? `${item.durationMs}ms` : '—'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.summary.criticalIssues > 0 && <SummaryBadge count={item.summary.criticalIssues} type="critical" />}
        {item.summary.warningIssues  > 0 && <SummaryBadge count={item.summary.warningIssues}  type="warning"  />}
        {item.clean && <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">Clean</span>}
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ReconciliationPage() {
  const [latest,      setLatest]      = useState<ReconciliationReport | null>(null);
  const [history,     setHistory]     = useState<ReconciliationHistoryItem[]>([]);
  const [selected,    setSelected]    = useState<ReconciliationReport | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [tab,         setTab]         = useState<'latest' | 'history'>('latest');

  useEffect(() => {
    Promise.all([
      financeService.getLatestReconciliation(),
      financeService.getReconciliationHistory(),
    ]).then(([lat, hist]) => {
      setLatest(lat);
      const rows = Array.isArray(hist?.data) ? hist.data : Array.isArray(hist) ? hist : [];
      setHistory(rows);
    }).finally(() => setLoading(false));
  }, []);

  const selectHistoryItem = async (id: string) => {
    setDetailLoading(true);
    try {
      const report = await financeService.getReconciliationById(id);
      setSelected(report);
      setTab('latest');
    } catch { /* silent */ }
    finally { setDetailLoading(false); }
  };

  const activeReport = selected ?? latest;

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-56 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Reconciliation</h1>
          <p className="text-sm text-gray-400 mt-0.5">Financial audit reports — checks for discrepancies between payment records and the ledger</p>
        </div>
        {history.length > 0 && (
          <div className="flex gap-2">
            <button type="button" onClick={() => { setSelected(null); setTab('latest'); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'latest' ? 'bg-[#1a3f1c] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              Latest Report
            </button>
            <button type="button" onClick={() => setTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'history' ? 'bg-[#1a3f1c] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              History ({history.length})
            </button>
          </div>
        )}
      </div>

      {/* No reports yet */}
      {!activeReport && tab === 'latest' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <RefreshCw className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">No reconciliation reports yet</p>
          <p className="text-sm text-gray-400 mt-1">Reports are generated automatically by the system or can be triggered manually from the mobile backend admin.</p>
        </div>
      )}

      {/* Latest / Selected report */}
      {tab === 'latest' && (activeReport || detailLoading) && (
        <>
          {detailLoading ? (
            <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ) : activeReport && (
            <>
              {/* Summary card */}
              <div className={`rounded-2xl p-5 border ${
                activeReport.clean
                  ? 'bg-green-50 border-green-200'
                  : activeReport.summary.criticalIssues > 0
                    ? 'bg-red-50 border-red-200'
                    : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    {activeReport.clean
                      ? <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" />
                      : <ShieldAlert  className="w-8 h-8 text-red-600   shrink-0" />}
                    <div>
                      <p className={`text-lg font-black ${activeReport.clean ? 'text-green-700' : 'text-red-700'}`}>
                        {activeReport.clean ? 'All Clear — No Issues Found' : `${activeReport.summary.totalIssues} Issue${activeReport.summary.totalIssues !== 1 ? 's' : ''} Found`}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(activeReport.runAt).toLocaleString('en-NG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        {' · '}{activeReport.triggeredBy}
                        {activeReport.durationMs ? ` · ${activeReport.durationMs}ms` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <SummaryBadge count={activeReport.summary.criticalIssues} type="critical" />
                    <SummaryBadge count={activeReport.summary.warningIssues}  type="warning"  />
                    <SummaryBadge count={activeReport.summary.infoIssues}     type="info"     />
                  </div>
                </div>
              </div>

              {/* Check details */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Check Results</p>
                {activeReport.checks.map(check => (
                  <CheckRow key={check.key} check={check} />
                ))}
              </div>

              {/* Errors during run */}
              {activeReport.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-bold text-red-700 mb-2">Errors during reconciliation run</p>
                  {activeReport.errors.map((e, i) => (
                    <p key={i} className="text-xs text-red-600">{e.check}: {e.message}</p>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* History tab */}
      {tab === 'history' && (
        <div className="modern-table-container">
          {history.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No history available</div>
          ) : (
            history.map(item => (
              <HistoryRow key={item.id} item={item} onSelect={() => selectHistoryItem(item.id)} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
