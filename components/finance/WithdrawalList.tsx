"use client";

import type { WithdrawalGroup } from "@/lib/api/services/finance.service";

interface Props {
  groups: WithdrawalGroup[];
  onInfo: (withdrawalId: string) => void;
  onPrint: (withdrawalId: string) => void;
}

function StatusBadge({ status }: { status: "PASS" | "FAIL" }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white whitespace-nowrap ${status === "PASS" ? "bg-[#1a3f1c]" : "bg-red-600"}`}
    >
      {status}
    </span>
  );
}

export function WithdrawalList({ groups, onInfo, onPrint }: Props) {
  if (groups.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-gray-400 text-sm">
        No withdrawals found.
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {groups.map((group) => (
        <div key={group.date}>
          <p className="text-sm font-semibold mb-2 text-[#1a3f1c]">{group.date}</p>

          <div className="rounded-xl overflow-hidden bg-gray-50 border-b border-gray-100">
            {group.withdrawals.map((wd, idx) => (
              <div
                key={wd.id}
                className={`flex items-center gap-3 px-4 py-3 ${idx !== 0 ? "border-t border-[#7dd880]/40" : ""}`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden border-2 border-white">
                  {wd.userAvatar ? (
                    <img
                      src={wd.userAvatar}
                      alt={wd.userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-400" />
                  )}
                </div>

                {/* Left info */}
                <div className="flex-1 min-w-0 text-xs sm:text-sm text-[#1a3f1c]">
                  <p className="font-semibold truncate">{wd.userName} made a withdrawal</p>
                  <p className="truncate">Bank: {wd.bankName}</p>
                  <p className="flex items-center gap-1.5 flex-wrap">
                    <span className="truncate">Withdrawal ID: {wd.withdrawalId}</span>
                  </p>
                </div>

                {/* Right info */}
                <div className="hidden sm:block flex-1 min-w-0 text-xs sm:text-sm text-[#1a3f1c]">
                  <p>Amount: ₦{wd.amount.toLocaleString()}</p>
                  <p>Narration: {wd.narration}</p>
                  <p className="flex items-center gap-1">
                    Status: <StatusBadge status={wd.status} />
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onInfo(wd.id)}
                    className="px-4 py-1.5 rounded text-xs font-semibold text-white hover:opacity-90 transition-opacity bg-[#1a3f1c]"
                  >
                    Info
                  </button>
                  <button
                    onClick={() => onPrint(wd.id)}
                    className="px-4 py-1.5 rounded text-xs font-semibold text-white hover:opacity-90 transition-opacity bg-[#1a3f1c]"
                  >
                    Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
