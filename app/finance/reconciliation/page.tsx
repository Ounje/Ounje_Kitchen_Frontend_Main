'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, ChevronDown, ChevronRight, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';
import financeService, {
  type ReconciliationReport,
  type ReconciliationHistoryItem,
} from '@/lib/api/services/finance.service';

// ── What each check means in plain English ────────────────────────────────────
const CHECK_INFO: Record<string, { title: string; plain: string; severity: 'critical' | 'warning' | 'info' }> = {
  orphanedPayments: {
    title: 'Payments Without Orders',
    plain: 'Money was received from a customer but there is no order linked to it. These payments are sitting without a home.',
    severity: 'critical',
  },
  missingRefunds: {
    title: 'Unpaid Refunds',
    plain: 'A customer\'s order was cancelled or declined, but their money has not been returned to them yet.',
    severity: 'critical',
  },
  duplicateLedgerEntries: {
    title: 'Duplicate Money Entries',
    plain: 'The same transaction appears more than once in the financial records. This could mean a vendor or rider was credited or debited twice.',
    severity: 'critical',
  },
  balanceMismatches: {
    title: 'Wallet Balance Errors',
    plain: 'A vendor or rider\'s wallet balance does not match what the transaction history says it should be.',
    severity: 'critical',
  },
  payoutsMissingLedger: {
    title: 'Bank Transfers With No Record',
    plain: 'Money was sent to a vendor or rider\'s bank account, but there is no corresponding entry in the financial ledger.',
    severity: 'warning',
  },
  paidOrdersNotCompleted: {
    title: 'Paid Orders Not Delivered',
    plain: 'A customer paid for an order but the order was never marked as delivered or completed.',
    severity: 'warning',
  },
  declinedOrdersNotRefunded: {
    title: 'Rejected Orders Not Refunded',
    plain: 'A vendor rejected or cancelled an order after the customer had already paid, but no refund was processed.',
    severity: 'warning',
  },
  holdLeaks: {
    title: 'Money Stuck On Hold',
    plain: 'Some funds are marked as "on hold" in a wallet but have been there too long and were never released or processed.',
    severity: 'warning',
  },
  pendingCheckoutLeaks: {
    title: 'Abandoned Checkouts',
    plain: 'A customer started paying but the process was never completed or cancelled. The payment reference is still open.',
    severity: 'info',
  },
  paystackVsDbMismatch: {
    title: 'Paystack vs Our Records Mismatch',
    plain: 'The amount Paystack (our payment provider) shows for a transaction does not match what our system recorded.',
    severity: 'critical',
  },
};

// ── Format helpers ────────────────────────────────────────────────────────────
function fmtDate(d: any) {
  if (!d) return '—';
  try { return new Date(d).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return '—'; }
}
function fmtAmt(n: any) {
  if (n == null) return null;
  const num = Number(n);
  if (isNaN(num)) return null;
  return `₦${num.toLocaleString()}`;
}
function shortId(id: any) {
  if (!id) return '—';
  const s = String(id);
  return s.length > 12 ? `...${s.slice(-8)}` : s;
}

// ── Render a single issue item in plain readable format ───────────────────────
function IssueCard({ item, index }: { item: any; index: number }) {
  const amount    = fmtAmt(item.amount ?? item.balance ?? item.difference ?? item.expectedBalance);
  const date      = fmtDate(item.createdAt ?? item.paidAt ?? item.cancelledAt ?? item.date ?? item.updatedAt);
  const ref       = item.reference ?? item.ref ?? item.transactionRef ?? null;
  const orderId   = item.orderId   ?? item.order   ?? null;
  const accountId = item.accountId ?? item.userId  ?? item.recipientId ?? null;
  const status    = item.status    ?? null;
  const reason    = item.failureReason ?? item.reason ?? null;

  const fields: { label: string; value: string }[] = [];
  if (amount)    fields.push({ label: 'Amount',    value: amount });
  if (ref)       fields.push({ label: 'Reference', value: shortId(ref) });
  if (orderId)   fields.push({ label: 'Order',     value: shortId(orderId) });
  if (accountId) fields.push({ label: 'Account',   value: shortId(accountId) });
  if (status)    fields.push({ label: 'Status',    value: String(status) });
  if (reason)    fields.push({ label: 'Reason',    value: String(reason) });
  if (date !== '—') fields.push({ label: 'Date',   value: date });

  // Fallback: show the first few readable keys if we couldn't extract anything
  if (fields.length === 0) {
    Object.entries(item).slice(0, 4).forEach(([k, v]) => {
      if (k === '_id' || k === '__v' || typeof v === 'object') return;
      fields.push({ label: k, value: String(v) });
    });
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Issue #{index + 1}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {fields.map(f => (
          <p key={f.label} className="text-sm text-gray-700">
            <span className="font-semibold text-gray-500">{f.label}: </span>{f.value}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── Check card ────────────────────────────────────────────────────────────────
function CheckCard({ checkKey, items }: { checkKey: string; items: any[] }) {
  const [expanded, setExpanded] = useState(false);
  const info     = CHECK_INFO[checkKey];
  const count    = items.length;
  const isClean  = count === 0;

  const severityStyle = {
    critical: { border: 'border-red-200',    bg: 'bg-red-50',    text: 'text-red-700',    icon: AlertCircle   },
    warning:  { border: 'border-amber-200',  bg: 'bg-amber-50',  text: 'text-amber-700',  icon: AlertTriangle },
    info:     { border: 'border-blue-200',   bg: 'bg-blue-50',   text: 'text-blue-700',   icon: Info          },
  }[info?.severity ?? 'info'];

  const Icon = isClean ? CheckCircle : severityStyle.icon;

  return (
    <div className={`rounded-xl border overflow-hidden ${isClean ? 'border-gray-100 bg-white' : severityStyle.border}`}>
      {/* Header */}
      <div className={`flex items-start justify-between p-4 ${isClean ? '' : severityStyle.bg}`}>
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isClean ? 'text-green-500' : severityStyle.text}`} />
          <div className="min-w-0">
            <p className={`text-sm font-bold ${isClean ? 'text-gray-700' : severityStyle.text}`}>
              {info?.title ?? checkKey}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{info?.plain}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {isClean ? (
            <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">No issues</span>
          ) : (
            <button type="button" onClick={() => setExpanded(e => !e)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${severityStyle.border} ${severityStyle.text} bg-white hover:opacity-80`}>
              {count} {count === 1 ? 'issue' : 'issues'}
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Issue list */}
      {!isClean && expanded && (
        <div className="border-t border-gray-100 p-4 space-y-2 bg-white">
          {items.map((item, i) => <IssueCard key={i} item={item} index={i} />)}
        </div>
      )}
    </div>
  );
}

// ── History row ───────────────────────────────────────────────────────────────
function HistoryRow({ item, onSelect }: { item: ReconciliationHistoryItem; onSelect: () => void }) {
  const total    = item.summary.totalIssues ?? 0;
  const critical = item.summary.criticalIssues ?? 0;
  const warning  = item.summary.warningIssues ?? 0;

  return (
    <button type="button" onClick={onSelect}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        {item.clean
          ? <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
          : <ShieldAlert  className="w-5 h-5 text-red-500  shrink-0" />}
        <div>
          <p className="text-sm font-semibold text-gray-800">{fmtDate(item.runAt)}</p>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">{item.triggeredBy} run{item.durationMs ? ` · ${item.durationMs}ms` : ''}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.clean ? (
          <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">All clear</span>
        ) : (
          <>
            {critical > 0 && <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">{critical} critical</span>}
            {warning  > 0 && <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">{warning} warnings</span>}
            {total > 0 && critical === 0 && warning === 0 && (
              <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">{total} issues</span>
            )}
          </>
        )}
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ReconciliationPage() {
  const [latest,        setLatest]        = useState<ReconciliationReport | null>(null);
  const [history,       setHistory]       = useState<ReconciliationHistoryItem[]>([]);
  const [selected,      setSelected]      = useState<ReconciliationReport | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [tab,           setTab]           = useState<'latest' | 'history'>('latest');

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
    setTab('latest');
    try {
      const report = await financeService.getReconciliationById(id);
      setSelected(report);
    } catch { /* silent */ }
    finally { setDetailLoading(false); }
  };

  const activeReport = selected ?? latest;

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-56 bg-gray-200 rounded mb-2" />
        <div className="h-5 w-96 bg-gray-100 rounded" />
        <div className="h-28 bg-gray-200 rounded-2xl mt-4" />
        {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Reconciliation</h1>
          <p className="text-sm text-gray-400 mt-1">
            Automatic checks that make sure every payment, refund, and bank transfer is properly accounted for.
          </p>
        </div>
        {history.length > 0 && (
          <div className="flex gap-2">
            <button type="button" onClick={() => { setSelected(null); setTab('latest'); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'latest' ? 'bg-[#1a3f1c] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              Latest Report
            </button>
            <button type="button" onClick={() => setTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'history' ? 'bg-[#1a3f1c] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              All Reports ({history.length})
            </button>
          </div>
        )}
      </div>

      {/* No reports */}
      {!activeReport && !detailLoading && tab === 'latest' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <ShieldCheck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold text-lg">No audit reports yet</p>
          <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
            The system runs financial checks automatically. Reports will appear here once the first check has been completed.
          </p>
        </div>
      )}

      {/* Latest / selected report */}
      {tab === 'latest' && (
        <>
          {detailLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-28 bg-gray-200 rounded-2xl" />
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
            </div>
          ) : activeReport && (
            <>
              {/* Top summary */}
              <div className={`rounded-2xl p-5 border ${
                activeReport.clean
                  ? 'bg-green-50 border-green-200'
                  : activeReport.summary.criticalIssues > 0
                    ? 'bg-red-50 border-red-200'
                    : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-4 flex-wrap">
                  {activeReport.clean
                    ? <ShieldCheck className="w-10 h-10 text-green-600 shrink-0" />
                    : <ShieldAlert  className="w-10 h-10 text-red-600   shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xl font-black ${activeReport.clean ? 'text-green-700' : activeReport.summary.criticalIssues > 0 ? 'text-red-700' : 'text-amber-700'}`}>
                      {activeReport.clean
                        ? 'Everything looks good — no issues found'
                        : `${activeReport.summary.totalIssues} problem${activeReport.summary.totalIssues !== 1 ? 's' : ''} found that need${activeReport.summary.totalIssues === 1 ? 's' : ''} attention`}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Report generated {fmtDate(activeReport.runAt)}
                      </p>
                      {!activeReport.clean && (
                        <>
                          {activeReport.summary.criticalIssues > 0 && (
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{activeReport.summary.criticalIssues} critical</span>
                          )}
                          {activeReport.summary.warningIssues > 0 && (
                            <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">{activeReport.summary.warningIssues} warnings</span>
                          )}
                          {activeReport.summary.infoIssues > 0 && (
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{activeReport.summary.infoIssues} info</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {!activeReport.clean && (
                  <p className="text-sm text-gray-600 mt-3 bg-white/60 rounded-lg p-3">
                    <strong>What to do:</strong> Click the buttons below to expand each issue and see the details. Share this report with your IT or operations team if you need help resolving them.
                  </p>
                )}
              </div>

              {/* Check cards */}
              <div className="space-y-3">
                {activeReport.checks.map(check => (
                  <CheckCard key={check.key} checkKey={check.key} items={check.items} />
                ))}
              </div>

              {/* System errors during the run */}
              {activeReport.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-bold text-red-700 mb-2">The system encountered errors while running some checks</p>
                  {activeReport.errors.map((e, i) => (
                    <p key={i} className="text-sm text-red-600 mt-1">• <strong>{CHECK_INFO[e.check]?.title ?? e.check}:</strong> {e.message}</p>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* History tab */}
      {tab === 'history' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Past Reports — click any row to view details</p>
          </div>
          {history.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No history available yet</div>
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
