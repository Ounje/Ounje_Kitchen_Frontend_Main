'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle, AlertCircle, AlertTriangle, Info,
  ChevronDown, ChevronRight, Clock, ShieldCheck, ShieldAlert,
  Wrench, RefreshCw, XCircle,
} from 'lucide-react';
import financeService, {
  type ReconciliationReport,
  type ReconciliationHistoryItem,
} from '@/lib/api/services/finance.service';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (d: any) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return '—'; }
};
const money = (n: any) => n != null && !isNaN(Number(n)) ? `₦${Number(n).toLocaleString()}` : null;
const shortId = (id: any) => { const s = String(id ?? ''); return s.length > 12 ? `…${s.slice(-8)}` : s; };

// ── Pill tags ─────────────────────────────────────────────────────────────────
function Tag({ label, color = 'gray' }: { label: string; color?: 'red' | 'amber' | 'blue' | 'gray' | 'green' }) {
  const cls = {
    red:   'bg-red-100 text-red-700 border-red-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    blue:  'bg-blue-100 text-blue-700 border-blue-200',
    gray:  'bg-gray-100 text-gray-600 border-gray-200',
    green: 'bg-green-100 text-green-700 border-green-200',
  }[color];
  return <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold border ${cls}`}>{label}</span>;
}

function SeverityBadge({ sev }: { sev: string }) {
  if (sev === 'CRITICAL') return <Tag label="CRITICAL" color="red" />;
  if (sev === 'WARNING')  return <Tag label="WARNING"  color="amber" />;
  return <Tag label="INFO" color="blue" />;
}

// ── Field row inside a card ───────────────────────────────────────────────────
function Fields({ pairs }: { pairs: [string, string | null | undefined][] }) {
  const visible = pairs.filter(([, v]) => v != null && v !== '' && v !== '—');
  if (!visible.length) return null;
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
      {visible.map(([k, v]) => (
        <p key={k} className="text-xs text-gray-600">
          <span className="font-semibold text-gray-400 uppercase tracking-wide mr-1">{k}</span>
          {v}
        </p>
      ))}
    </div>
  );
}

// ── Type-specific issue renderers ─────────────────────────────────────────────

function OrphanedPaymentCard({ item, idx }: { item: any; idx: number }) {
  return (
    <div className="bg-white rounded-xl border border-red-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-black text-red-600">{money(item.amountNaira) ?? '—'}</span>
            <span className="text-sm text-gray-600">received · no order created</span>
            <SeverityBadge sev={item.severity ?? 'CRITICAL'} />
          </div>
          <Fields pairs={[
            ['Reference', item.reference],
            ['Customer ID', shortId(item.customerId)],
            ['Payment ID', shortId(item.paymentId)],
            ['Paid', fmt(item.paidAt)],
            ['Checkout age', item.pendingCheckoutAge ? `Still has open checkout · ${item.pendingCheckoutAge}` : null],
          ]} />
          <p className="text-xs text-gray-400 mt-2 italic">{item.issue}</p>
        </div>
        <span className="text-xs font-bold text-gray-300 shrink-0">#{idx + 1}</span>
      </div>
    </div>
  );
}

function MissingRefundCard({ item, idx }: { item: any; idx: number }) {
  return (
    <div className="bg-white rounded-xl border border-red-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-black text-red-600">{money(item.amountNaira) ?? '—'}</span>
            <span className="text-sm text-gray-600">owed to customer · never refunded</span>
            {item.ageHours != null && <Tag label={`${item.ageHours}h ago`} color="amber" />}
          </div>
          <Fields pairs={[
            ['Order #', item.orderNumber],
            ['Status', item.status],
            ['Payment', item.paymentMethod],
            ['Customer', shortId(item.customerId)],
            ['Vendor', shortId(item.vendorId)],
            ['Terminated', fmt(item.terminatedAt)],
          ]} />
          <p className="text-xs text-gray-400 mt-2 italic">{item.issue}</p>
        </div>
        <span className="text-xs font-bold text-gray-300 shrink-0">#{idx + 1}</span>
      </div>
    </div>
  );
}

function DuplicateEntryCard({ item, idx }: { item: any; idx: number }) {
  return (
    <div className="bg-white rounded-xl border border-red-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-black text-red-600">{money(item.totalAmountNaira) ?? '—'}</span>
            <span className="text-sm text-gray-600">posted {item.duplicateCount ?? 2}× for same transaction</span>
            <Tag label={`${item.duplicateCount ?? 2} duplicates`} color="red" />
          </div>
          <Fields pairs={[
            ['Reason', item.reason],
            ['Account', shortId(item.accountId)],
            ['Order', shortId(item.orderId)],
            ['Per-entry amount', money(item.totalAmountNaira && item.duplicateCount ? item.totalAmountNaira / item.duplicateCount : null)],
          ]} />
          <p className="text-xs text-gray-400 mt-2 italic">{item.issue}</p>
        </div>
        <span className="text-xs font-bold text-gray-300 shrink-0">#{idx + 1}</span>
      </div>
    </div>
  );
}

function BalanceMismatchCard({ item, idx }: { item: any; idx: number }) {
  const stored   = item.stored   ?? {};
  const computed = item.computed ?? {};
  const disc     = item.discrepancy ?? {};
  const totalOff = (disc.available ?? 0) + (disc.pending ?? 0) + (disc.hold ?? 0);

  return (
    <div className="bg-white rounded-xl border border-red-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag label={item.accountType ?? 'UNKNOWN'} color={item.accountType === 'VENDOR' ? 'blue' : item.accountType === 'RIDER' ? 'green' : 'gray'} />
            <span className="text-base font-black text-red-600">off by {money(totalOff) ?? '?'}</span>
            <SeverityBadge sev={item.severity ?? 'CRITICAL'} />
          </div>

          {/* Balance comparison table */}
          <div className="mt-3 grid grid-cols-4 gap-1 text-xs">
            <div className="text-gray-400 font-bold uppercase tracking-wide">Bucket</div>
            <div className="text-gray-400 font-bold uppercase tracking-wide">Stored</div>
            <div className="text-gray-400 font-bold uppercase tracking-wide">Should Be</div>
            <div className="text-gray-400 font-bold uppercase tracking-wide">Diff</div>

            {[
              ['Available', stored.availableBalance, computed.availableBalance, disc.available],
              ['Pending',   stored.pendingBalance,   computed.pendingBalance,   disc.pending],
              ['Hold',      stored.holdBalance,      computed.holdBalance,      disc.hold],
            ].map(([label, s, c, d]) => (
              <>
                <div key={`l-${label}`} className="font-semibold text-gray-600">{label}</div>
                <div key={`s-${label}`} className="tabular-nums text-gray-700">{money(s) ?? '₦0'}</div>
                <div key={`c-${label}`} className="tabular-nums text-gray-700">{money(c) ?? '₦0'}</div>
                <div key={`d-${label}`} className={`tabular-nums font-bold ${(d ?? 0) > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {(d ?? 0) > 0 ? `₦${Number(d).toLocaleString()}` : '—'}
                </div>
              </>
            ))}
          </div>

          <Fields pairs={[
            ['Account', shortId(item.accountId)],
            ['User', shortId(item.userId)],
            ['Entries checked', item.entryCount != null ? String(item.entryCount) : null],
          ]} />
        </div>
        <span className="text-xs font-bold text-gray-300 shrink-0">#{idx + 1}</span>
      </div>
    </div>
  );
}

function PayoutMissingLedgerCard({ item, idx }: { item: any; idx: number }) {
  return (
    <div className="bg-white rounded-xl border border-amber-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-black text-amber-600">{money(item.amountNaira) ?? '—'}</span>
            <span className="text-sm text-gray-600">bank transfer · no ledger record</span>
            <Tag label={item.recipientType ?? 'UNKNOWN'} color="blue" />
          </div>
          <Fields pairs={[
            ['Reference', item.reference],
            ['Transfer code', item.transferCode],
            ['Recipient', shortId(item.recipientId)],
            ['Net paid', money(item.netAmountNaira)],
            ['Processed', fmt(item.processedAt)],
          ]} />
          <p className="text-xs text-gray-400 mt-2 italic">{item.issue}</p>
        </div>
        <span className="text-xs font-bold text-gray-300 shrink-0">#{idx + 1}</span>
      </div>
    </div>
  );
}

function StuckOrderCard({ item, idx }: { item: any; idx: number }) {
  return (
    <div className="bg-white rounded-xl border border-amber-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-black text-amber-600">{money(item.amountNaira) ?? '—'}</span>
            <span className="text-sm text-gray-600">paid · stuck confirming</span>
            {item.stuckForMinutes != null && <Tag label={`${item.stuckForMinutes} mins`} color="amber" />}
          </div>
          <Fields pairs={[
            ['Order #', item.orderNumber],
            ['Payment', item.paymentMethod],
            ['Customer', shortId(item.customerId)],
            ['Vendor', shortId(item.vendorId)],
            ['Created', fmt(item.createdAt)],
          ]} />
          <p className="text-xs text-gray-400 mt-2 italic">{item.issue}</p>
        </div>
        <span className="text-xs font-bold text-gray-300 shrink-0">#{idx + 1}</span>
      </div>
    </div>
  );
}

function HoldLeakCard({ item, idx }: { item: any; idx: number }) {
  const type = item.type === 'VENDOR_HOLD_LEAK' ? 'Vendor' : 'Rider';
  return (
    <div className="bg-white rounded-xl border border-red-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-black text-red-600">{money(item.holdAmount) ?? '—'}</span>
            <span className="text-sm text-gray-600">stuck in hold · never released</span>
            <Tag label={`${type} hold`} color="red" />
          </div>
          <Fields pairs={[
            ['Order', shortId(item.orderId)],
            ['Order status', item.orderStatus],
            [type === 'Vendor' ? 'Vendor' : 'Rider', shortId(item.vendorId ?? item.riderId)],
            ['Hold entry', shortId(item.holdEntryId)],
          ]} />
          <p className="text-xs text-gray-400 mt-2 italic">{item.issue}</p>
        </div>
        <span className="text-xs font-bold text-gray-300 shrink-0">#{idx + 1}</span>
      </div>
    </div>
  );
}

function PendingCheckoutCard({ item, idx }: { item: any; idx: number }) {
  const isCritical = item.severity === 'CRITICAL';
  return (
    <div className={`bg-white rounded-xl border p-4 ${isCritical ? 'border-red-100' : 'border-amber-100'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag label={`${item.ageHours ?? '?'}h old`} color={isCritical ? 'red' : 'amber'} />
            <span className="text-sm text-gray-600">abandoned checkout</span>
            <Tag label={`Payment: ${item.paymentStatus ?? 'unknown'}`} color={item.paymentStatus === 'success' ? 'red' : 'gray'} />
            {item.paymentAmountNaira != null && <span className="text-sm font-bold text-gray-700">{money(item.paymentAmountNaira)}</span>}
          </div>
          <Fields pairs={[
            ['Reference', item.reference],
            ['Customer', shortId(item.customerId)],
            ['Started', fmt(item.createdAt)],
          ]} />
          <p className="text-xs text-gray-400 mt-2 italic">{item.issue}</p>
        </div>
        <span className="text-xs font-bold text-gray-300 shrink-0">#{idx + 1}</span>
      </div>
    </div>
  );
}

function PaystackMismatchCard({ item, idx }: { item: any; idx: number }) {
  const isInfo = item.severity === 'INFO';
  return (
    <div className={`bg-white rounded-xl border p-4 ${isInfo ? 'border-blue-100' : 'border-red-100'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge sev={item.severity ?? 'CRITICAL'} />
            {item.paystackAmountNaira != null && item.dbAmountNaira != null && (
              <>
                <span className="text-sm text-gray-600">Paystack: <strong className="text-gray-800">{money(item.paystackAmountNaira)}</strong></span>
                <span className="text-gray-400">vs</span>
                <span className="text-sm text-gray-600">DB: <strong className="text-gray-800">{money(item.dbAmountNaira)}</strong></span>
                {item.discrepancyNaira > 0 && <Tag label={`diff ${money(item.discrepancyNaira)}`} color="red" />}
              </>
            )}
            {item.dbAmountNaira != null && item.paystackAmountNaira == null && (
              <span className="text-sm text-gray-600">DB has record · not in Paystack list</span>
            )}
            {item.paystackAmountNaira != null && item.dbAmountNaira == null && (
              <span className="text-sm font-bold text-red-600">{money(item.paystackAmountNaira)} · NO DB record</span>
            )}
          </div>
          <Fields pairs={[
            ['Reference', item.reference],
            ['Paystack status', item.paystackStatus],
            ['DB status', item.dbStatus],
            ['Payment ID', shortId(item.paymentId)],
          ]} />
          <p className="text-xs text-gray-400 mt-2 italic">{item.issue}</p>
        </div>
        <span className="text-xs font-bold text-gray-300 shrink-0">#{idx + 1}</span>
      </div>
    </div>
  );
}

function GenericCard({ item, idx }: { item: any; idx: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Issue #{idx + 1}</p>
      <div className="flex flex-wrap gap-x-5 gap-y-1">
        {Object.entries(item).slice(0, 8).map(([k, v]) => {
          if (k === '_id' || k === '__v' || typeof v === 'object') return null;
          return (
            <p key={k} className="text-xs text-gray-600">
              <span className="font-semibold text-gray-400 uppercase tracking-wide mr-1">{k}</span>
              {String(v)}
            </p>
          );
        })}
      </div>
      {item.issue && <p className="text-xs text-gray-400 mt-2 italic">{item.issue}</p>}
    </div>
  );
}

function renderIssue(checkKey: string, item: any, idx: number) {
  switch (checkKey) {
    case 'orphanedPayments':        return <OrphanedPaymentCard    key={idx} item={item} idx={idx} />;
    case 'missingRefunds':
    case 'declinedOrdersNotRefunded': return <MissingRefundCard    key={idx} item={item} idx={idx} />;
    case 'duplicateLedgerEntries':  return <DuplicateEntryCard     key={idx} item={item} idx={idx} />;
    case 'balanceMismatches':       return <BalanceMismatchCard    key={idx} item={item} idx={idx} />;
    case 'payoutsMissingLedger':    return <PayoutMissingLedgerCard key={idx} item={item} idx={idx} />;
    case 'paidOrdersNotCompleted':  return <StuckOrderCard         key={idx} item={item} idx={idx} />;
    case 'holdLeaks':               return <HoldLeakCard           key={idx} item={item} idx={idx} />;
    case 'pendingCheckoutLeaks':    return <PendingCheckoutCard    key={idx} item={item} idx={idx} />;
    case 'paystackVsDbMismatch':    return <PaystackMismatchCard   key={idx} item={item} idx={idx} />;
    default:                        return <GenericCard            key={idx} item={item} idx={idx} />;
  }
}

// ── What each check means ─────────────────────────────────────────────────────
const CHECK_META: Record<string, { title: string; plain: string; severity: 'critical' | 'warning' | 'info'; canFix?: boolean }> = {
  orphanedPayments:         { title: 'Payments Without Orders',         plain: 'Paystack confirmed money was received but your system has no order for it — the customer paid and got nothing.',       severity: 'critical' },
  missingRefunds:           { title: 'Unpaid Refunds',                  plain: "A customer's order was cancelled or declined after they paid, but the refund was never issued back to their wallet.",  severity: 'critical' },
  duplicateLedgerEntries:   { title: 'Duplicate Money Entries',         plain: 'The same debit or credit was written to the ledger more than once for the same order — a vendor or rider may have been paid or charged twice.', severity: 'critical', canFix: true },
  balanceMismatches:        { title: 'Wallet Balance Errors',           plain: "A wallet's stored balance doesn't add up when you re-sum the actual transaction history. The number shown is wrong.",  severity: 'critical', canFix: true },
  payoutsMissingLedger:     { title: 'Bank Transfers With No Record',   plain: 'Money was sent to a vendor or rider bank account but the corresponding deduction from their wallet was never recorded.', severity: 'warning' },
  paidOrdersNotCompleted:   { title: 'Paid Orders Stuck Confirming',   plain: 'A customer paid more than 30 minutes ago but the order is still waiting for the vendor to accept — the vendor may not have been notified.', severity: 'warning' },
  declinedOrdersNotRefunded:{ title: 'Rejected Orders Not Refunded',   plain: "A vendor rejected an order after the customer already paid. The customer's money was never returned.",                severity: 'warning' },
  holdLeaks:                { title: 'Money Stuck On Hold',             plain: "Funds were put on hold for a vendor or rider when the order was placed, but the order is now done and the hold was never released — their wallet is inflated.", severity: 'warning' },
  pendingCheckoutLeaks:     { title: 'Abandoned Checkouts',             plain: 'A payment session was started over 2 hours ago and never completed or cancelled. If the payment actually went through, an order may be missing.', severity: 'info' },
  paystackVsDbMismatch:     { title: 'Paystack vs Our Records',         plain: "Cross-check of Paystack's last 200 transactions against your database. Flags payments Paystack confirmed that your system never recorded, or amount mismatches.", severity: 'critical' },
};

// ── Fix button ────────────────────────────────────────────────────────────────
function FixButton({
  checkKey, count, onFixed,
}: { checkKey: string; count: number; onFixed: () => void }) {
  const [state, setState] = useState<'idle' | 'confirm' | 'running' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<string>('');

  const run = async () => {
    setState('running');
    try {
      if (checkKey === 'duplicateLedgerEntries') {
        const r = await financeService.fixDuplicateEntries();
        setResult(`Removed ${r.deletedEntries} duplicate entries across ${r.affectedAccounts} accounts`);
      } else {
        const r = await financeService.fixWalletBalances();
        setResult(`Corrected ${r.updatedAccounts} of ${r.totalChecked} wallet balances`);
      }
      setState('done');
      setTimeout(() => { setState('idle'); onFixed(); }, 3000);
    } catch {
      setState('error');
      setResult('Fix failed — check server logs');
      setTimeout(() => setState('idle'), 4000);
    }
  };

  if (state === 'done') return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
      <CheckCircle className="w-3.5 h-3.5" /> {result}
    </span>
  );
  if (state === 'error') return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
      <XCircle className="w-3.5 h-3.5" /> {result}
    </span>
  );
  if (state === 'running') return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fixing…
    </span>
  );
  if (state === 'confirm') return (
    <span className="flex items-center gap-2">
      <span className="text-xs text-gray-600">Fix {count} {checkKey === 'duplicateLedgerEntries' ? 'duplicate groups' : 'wallets'}?</span>
      <button type="button" onClick={run} className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors">Yes, Fix</button>
      <button type="button" onClick={() => setState('idle')} className="text-xs font-bold text-gray-500 hover:text-gray-700">Cancel</button>
    </span>
  );
  return (
    <button type="button" onClick={() => setState('confirm')}
      className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#1a3f1c] hover:bg-[#163318] px-3 py-1.5 rounded-lg transition-colors">
      <Wrench className="w-3.5 h-3.5" />
      {checkKey === 'duplicateLedgerEntries' ? 'Fix Duplicates' : 'Recalculate Balances'}
    </button>
  );
}

// ── Check card ────────────────────────────────────────────────────────────────
function CheckCard({ checkKey, items, onFixed }: { checkKey: string; items: any[]; onFixed: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const meta     = CHECK_META[checkKey];
  const count    = items.length;
  const isClean  = count === 0;
  const canFix   = meta?.canFix && count > 0;

  const colorSet = {
    critical: { border: 'border-red-200',    bg: 'bg-red-50/80',    text: 'text-red-700',    icon: AlertCircle,   badge: 'text-red-600 bg-red-100 border-red-200'  },
    warning:  { border: 'border-amber-200',  bg: 'bg-amber-50/80',  text: 'text-amber-700',  icon: AlertTriangle, badge: 'text-amber-600 bg-amber-100 border-amber-200' },
    info:     { border: 'border-blue-200',   bg: 'bg-blue-50/80',   text: 'text-blue-700',   icon: Info,          badge: 'text-blue-600 bg-blue-100 border-blue-200'  },
  }[meta?.severity ?? 'info'];

  const Icon = isClean ? CheckCircle : colorSet.icon;

  return (
    <div className={`rounded-xl border overflow-hidden shadow-sm ${isClean ? 'border-gray-100' : colorSet.border}`}>
      {/* Header */}
      <div className={`flex items-start gap-3 p-4 ${isClean ? 'bg-white' : colorSet.bg}`}>
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isClean ? 'text-green-500' : colorSet.text}`} />

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${isClean ? 'text-gray-700' : colorSet.text}`}>
            {meta?.title ?? checkKey}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed max-w-2xl">{meta?.plain}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {canFix && <FixButton checkKey={checkKey} count={count} onFixed={onFixed} />}

          {isClean ? (
            <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">No issues</span>
          ) : (
            <button type="button" onClick={() => setExpanded(e => !e)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${colorSet.badge}`}>
              {count} {count === 1 ? 'issue' : 'issues'}
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded issue list */}
      {!isClean && expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-3">
          {items.map((item, i) => renderIssue(checkKey, item, i))}
        </div>
      )}
    </div>
  );
}

// ── History row ───────────────────────────────────────────────────────────────
function HistoryRow({ item, onSelect }: { item: ReconciliationHistoryItem; onSelect: () => void }) {
  const crit = item.summary.criticalIssues ?? 0;
  const warn = item.summary.warningIssues  ?? 0;
  return (
    <button type="button" onClick={onSelect}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        {item.clean
          ? <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
          : <ShieldAlert  className="w-5 h-5 text-red-500  shrink-0" />}
        <div>
          <p className="text-sm font-semibold text-gray-800">{fmt(item.runAt)}</p>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">
            {item.triggeredBy} run{item.durationMs ? ` · ${item.durationMs}ms` : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.clean ? (
          <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">All clear</span>
        ) : (
          <>
            {crit > 0 && <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">{crit} critical</span>}
            {warn > 0 && <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">{warn} warnings</span>}
          </>
        )}
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ReconciliationPage() {
  const [latest,        setLatest]        = useState<ReconciliationReport | null>(null);
  const [history,       setHistory]       = useState<ReconciliationHistoryItem[]>([]);
  const [selected,      setSelected]      = useState<ReconciliationReport | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [tab,           setTab]           = useState<'latest' | 'history'>('latest');

  const loadLatest = useCallback(async () => {
    try {
      const [lat, hist] = await Promise.all([
        financeService.getLatestReconciliation(),
        financeService.getReconciliationHistory(),
      ]);
      setLatest(lat);
      const rows = Array.isArray(hist?.data) ? hist.data : Array.isArray(hist) ? hist : [];
      setHistory(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadLatest(); }, [loadLatest]);

  const selectHistory = async (id: string) => {
    setDetailLoading(true);
    setTab('latest');
    try { setSelected(await financeService.getReconciliationById(id)); }
    catch { /* silent */ }
    finally { setDetailLoading(false); }
  };

  const activeReport = selected ?? latest;

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-56 bg-gray-200 rounded mb-2" />
      <div className="h-5 w-96 bg-gray-100 rounded" />
      <div className="h-28 bg-gray-200 rounded-2xl mt-4" />
      {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
    </div>
  );

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Reconciliation</h1>
          <p className="text-sm text-gray-400 mt-1">
            Automated financial health checks — finds payments, refunds, and balances that don't add up.
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

      {/* No reports yet */}
      {!activeReport && !detailLoading && tab === 'latest' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <ShieldCheck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold text-lg">No audit reports yet</p>
          <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
            Reports are generated automatically by the system. They will appear here once the first check has run.
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
              {/* Summary banner */}
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
                    <p className={`text-xl font-black ${activeReport.clean ? 'text-green-700' : 'text-red-700'}`}>
                      {activeReport.clean
                        ? 'All clear — no issues found'
                        : `${activeReport.summary.totalIssues} issue${activeReport.summary.totalIssues !== 1 ? 's' : ''} need your attention`}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Report from {fmt(activeReport.runAt)}
                      </p>
                      {(activeReport.summary.criticalIssues ?? 0) > 0 && (
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{activeReport.summary.criticalIssues} critical</span>
                      )}
                      {(activeReport.summary.warningIssues ?? 0) > 0 && (
                        <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">{activeReport.summary.warningIssues} warnings</span>
                      )}
                      {(activeReport.summary.infoIssues ?? 0) > 0 && (
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{activeReport.summary.infoIssues} info</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* What to do guide — only for issues that need manual action */}
                {!activeReport.clean && (
                  <div className="mt-4 bg-white/70 rounded-xl p-4 space-y-2">
                    <p className="text-sm font-bold text-gray-700">What to do:</p>
                    <ul className="text-sm text-gray-600 space-y-1.5">
                      {(activeReport.checks.find(c => c.key === 'duplicateLedgerEntries')?.count ?? 0) > 0 && (
                        <li>⚙️ <strong>Duplicate entries</strong> — click "Fix Duplicates" on that section. It removes extra records automatically.</li>
                      )}
                      {(activeReport.checks.find(c => c.key === 'balanceMismatches')?.count ?? 0) > 0 && (
                        <li>⚙️ <strong>Wallet balance errors</strong> — click "Recalculate Balances". It re-sums every wallet from transaction history and corrects the stored value.</li>
                      )}
                      {(activeReport.checks.find(c => c.key === 'orphanedPayments')?.count ?? 0) > 0 && (
                        <li>🔍 <strong>Payments without orders</strong> — each needs manual review. Open Paystack dashboard, find the reference, and either process the order or issue a refund to the customer.</li>
                      )}
                      {(activeReport.checks.find(c => c.key === 'missingRefunds')?.count ?? 0) > 0 && (
                        <li>🔍 <strong>Unpaid refunds</strong> — share the order numbers with your IT team to manually trigger refunds for each affected customer.</li>
                      )}
                      {(activeReport.checks.find(c => c.key === 'paidOrdersNotCompleted')?.count ?? 0) > 0 && (
                        <li>📞 <strong>Stuck orders</strong> — contact the vendor directly or escalate through Operations to get the order confirmed or cancelled.</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Check sections */}
              <div className="space-y-3">
                {activeReport.checks.map(check => (
                  <CheckCard
                    key={check.key}
                    checkKey={check.key}
                    items={check.items}
                    onFixed={() => {
                      // Clear this check's items immediately in local state so the count drops to 0
                      setLatest(prev => {
                        if (!prev) return prev;
                        const cleared = prev.checks.map(c =>
                          c.key === check.key ? { ...c, items: [], count: 0 } : c
                        );
                        const remaining = cleared.reduce((s, c) => s + (c.count ?? 0), 0);
                        return { ...prev, checks: cleared, summary: { ...prev.summary, totalIssues: remaining }, clean: remaining === 0 };
                      });
                      setSelected(null);
                    }}
                  />
                ))}
              </div>

              {/* System errors during run */}
              {activeReport.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-bold text-red-700 mb-2">The system hit errors while running some checks</p>
                  {activeReport.errors.map((e, i) => (
                    <p key={i} className="text-sm text-red-600 mt-1">
                      • <strong>{CHECK_META[e.check]?.title ?? e.check}:</strong> {e.message}
                    </p>
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
              <HistoryRow key={item.id} item={item} onSelect={() => selectHistory(item.id)} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
