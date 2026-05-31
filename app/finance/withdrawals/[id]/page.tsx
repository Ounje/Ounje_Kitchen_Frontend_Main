'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ModalWatermark } from '@/components/finance/ModalWatermark';
import financeService, { type WithdrawalDetail } from '@/lib/api/services/finance.service';

type Status = 'PASS' | 'FAIL' | 'PENDING';

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    PASS:    'bg-[#1a3f1c] text-white',
    FAIL:    'bg-red-600 text-white',
    PENDING: 'bg-yellow-500 text-white',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function WithdrawalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [detail, setDetail]       = useState<WithdrawalDetail | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [note, setNote]           = useState('');
  const [processing, setProcessing] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    if (!id) return;
    setError(false);
    financeService.getWithdrawalDetail(id)
      .then((res: any) => {
        const payload = res?.data ?? res;
        setDetail(payload as WithdrawalDetail);
        setNote(payload?.note || '');
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async () => {
    if (!detail || processing) return;
    setProcessing('approve');
    try {
      await financeService.approveWithdrawal(id, note);
      toast.success('Withdrawal approved');
      setDetail(prev => prev ? { ...prev, status: 'PASS', note } : prev);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to approve withdrawal');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!detail || processing) return;
    setProcessing('reject');
    try {
      await financeService.rejectWithdrawal(id, note);
      toast.success('Withdrawal rejected');
      setDetail(prev => prev ? { ...prev, status: 'FAIL', note } : prev);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject withdrawal');
    } finally {
      setProcessing(null);
    }
  };

  const handleDownload = () => window.print();

  return (
    <div className="min-h-screen w-full flex items-start justify-center py-6 px-4 print:p-0 bg-gray-50">
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl print:shadow-none print:rounded-none print:max-w-full bg-gray-50"
        id="withdrawal-slip"
      >
        <ModalWatermark />

        {/* Header */}
        <div className="relative flex items-center justify-center px-12 py-5 border-b border-[#98EF9B]/50">
          <h1 className="font-bold text-sm sm:text-base text-center break-all text-[#1a3f1c]">
            {loading ? '—' : detail?.withdrawalId ?? '—'}
          </h1>
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.back()}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors print:hidden"
          >
            <X className="w-5 h-5 text-[#1a3f1c]" />
          </button>
        </div>

        <div className="relative px-5 sm:px-8 py-5 space-y-5">
          {loading ? (
            <div className="space-y-3 py-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : error || !detail ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {error ? 'Failed to load withdrawal.' : 'Withdrawal not found.'}
              </p>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg text-white text-sm bg-[#1a3f1c]"
              >
                Go Back
              </button>
            </div>
          ) : (
            <>
              {/* Personal Details */}
              <section>
                <p className="text-sm font-semibold mb-2 text-[#1a3f1c]">Personal Details</p>
                <div className="rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm bg-[#98ef9b]/40">
                  <span className="text-[#1a3f1c]"><b>Vendor:</b> {detail.vendorName}</span>
                  <span className="text-[#1a3f1c]"><b>Bank:</b> {detail.bankName}</span>
                  <span className="text-[#1a3f1c]"><b>Account Number:</b> {detail.accountNumber}</span>
                </div>
              </section>

              {/* Transaction Details */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold underline decoration-blue-500 text-blue-600 cursor-default">
                    Transaction Details
                  </p>
                  <p className="text-sm text-[#1a3f1c]">Payment Method: {detail.paymentMethod}</p>
                </div>
                <div className="rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm bg-[#98ef9b]/40">
                  <span className="break-all text-[#1a3f1c]"><b>Withdrawal ID:</b> {detail.withdrawalId}</span>
                  <span className="text-[#1a3f1c]"><b>Amount:</b> ₦{detail.amount.toLocaleString()}</span>
                  <span className="flex items-center gap-2 text-[#1a3f1c]">
                    <b>Status:</b>
                    <StatusBadge status={detail.status} />
                  </span>
                </div>
              </section>

              {/* Note */}
              <section>
                <p className="text-sm font-semibold mb-2 text-[#1a3f1c]">Note</p>
                {detail.status === 'PENDING' ? (
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Add a note (optional)..."
                    rows={3}
                    className="w-full rounded-lg px-4 py-3 text-sm bg-[#98ef9b]/40 text-[#1a3f1c] border border-[#98ef9b] resize-none focus:outline-none focus:ring-2 focus:ring-[#1a3f1c]/30 print:hidden"
                  />
                ) : (
                  <div className="rounded-lg px-4 py-3 text-sm bg-[#98ef9b]/40 text-[#1a3f1c]">
                    {detail.note || '—'}
                  </div>
                )}
              </section>

              {/* Approve / Reject — only for PENDING */}
              {detail.status === 'PENDING' && (
                <div className="flex gap-3 print:hidden">
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={!!processing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm bg-[#1a3f1c] hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {processing === 'approve' ? 'Approving…' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={!!processing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm bg-red-600 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    {processing === 'reject' ? 'Rejecting…' : 'Reject'}
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && detail && detail.status !== 'PENDING' && (
            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity print:hidden bg-[#1a3f1c]"
            >
              Download Slip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
