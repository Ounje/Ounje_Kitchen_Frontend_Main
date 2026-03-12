"use client";

import { useState, useEffect, useCallback } from 'react';
import { superAdminService } from '@/lib/api/services/superadmin.service';

type Tab = 'customers' | 'vendors' | 'riders';

// ── Skeleton Row ──────────────────────────────────────────────────────────────
function SkeletonRow({ cols }: { cols: number }) {
  const widths = [160, 200, 140, 140, 80, 70];
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3.5 bg-gray-100 rounded" style={{ width: widths[i] ?? 100 }} />
        </td>
      ))}
    </tr>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ user }: { user: any }) {
  const suspended = user?.isSuspended === true;
  const inactive  = user?.isActive === false;
  if (suspended) return <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-red-100 text-red-700">Suspended</span>;
  if (inactive)  return <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-700">Inactive</span>;
  return <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">Active</span>;
}

function isSuspendedOrInactive(user: any) {
  return user?.isSuspended === true || user?.isActive === false;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<Tab>('customers');
  const [users, setUsers]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [actionId, setActionId]   = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      let res: any;
      if (activeTab === 'customers')    res = await superAdminService.getCustomers({ page: 1, limit: 20 });
      else if (activeTab === 'vendors') res = await superAdminService.getVendors({ page: 1, limit: 20 });
      else                              res = await superAdminService.getRiders({ page: 1, limit: 20 });
      const rows = res?.data ?? res?.customers ?? res?.vendors ?? res?.riders ?? [];
      setUsers(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleSuspend = async (id: string) => {
    setActionId(id);
    try {
      if (activeTab === 'customers')    await superAdminService.suspendCustomer(id);
      else if (activeTab === 'vendors') await superAdminService.suspendVendor(id);
      else                              await superAdminService.suspendRider(id);
      await loadUsers();
    } catch (err) { console.error(err); }
    finally { setActionId(null); }
  };

  const handleActivate = async (id: string) => {
    setActionId(id);
    try {
      if (activeTab === 'customers')    await superAdminService.activateCustomer(id);
      else if (activeTab === 'vendors') await superAdminService.activateVendor(id);
      else                              await superAdminService.activateRider(id);
      await loadUsers();
    } catch (err) { console.error(err); }
    finally { setActionId(null); }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'customers', label: 'Customers' },
    { key: 'vendors',   label: 'Vendors'   },
    { key: 'riders',    label: 'Riders'    },
  ];

  // ── Per-tab column definitions ──────────────────────────────────────────────
  const customerCols = ['Name', 'Email', 'Phone', 'Status', 'Actions'];
  const vendorCols   = ['Business Name', 'Owner', 'Email', 'Phone', 'Status', 'Actions'];
  const riderCols    = ['Name', 'Email', 'Phone', 'Operating Area', 'Rank', 'Status', 'Actions'];

  const headers =
    activeTab === 'customers' ? customerCols :
    activeTab === 'vendors'   ? vendorCols   : riderCols;

  return (
    <div className="px-2">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User & Staff</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-md transition-colors ${
              activeTab === key
                ? 'bg-white border border-b-0 border-gray-200 text-[#1a3f1c] font-semibold -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {headers.map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonRow key={i} cols={headers.length} />
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="px-5 py-14 text-center text-sm text-gray-400">
                    No records found.
                  </td>
                </tr>
              ) : activeTab === 'customers' ? (
                users.map((u: any) => {
                  const id   = u._id ?? u.id;
                  const busy = actionId === id;
                  return (
                    <tr key={id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                        {u?.user?.name || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {u?.user?.email || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {u?.user?.phone ? String(u.user.phone) : '—'}
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge user={u} /></td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {isSuspendedOrInactive(u) ? (
                          <button disabled={busy} onClick={() => handleActivate(id)}
                            className="text-[#1a3f1c] hover:underline font-medium disabled:opacity-40">
                            {busy ? '…' : 'Activate'}
                          </button>
                        ) : (
                          <button disabled={busy} onClick={() => handleSuspend(id)}
                            className="text-red-600 hover:underline font-medium disabled:opacity-40">
                            {busy ? '…' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : activeTab === 'vendors' ? (
                users.map((u: any) => {
                  const id   = u._id ?? u.id;
                  const busy = actionId === id;
                  return (
                    <tr key={id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                        {u?.name || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {u?.owner?.name || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {u?.owner?.email || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {u?.owner?.phone ? String(u.owner.phone) : '—'}
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge user={u} /></td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {isSuspendedOrInactive(u) ? (
                          <button disabled={busy} onClick={() => handleActivate(id)}
                            className="text-[#1a3f1c] hover:underline font-medium disabled:opacity-40">
                            {busy ? '…' : 'Activate'}
                          </button>
                        ) : (
                          <button disabled={busy} onClick={() => handleSuspend(id)}
                            className="text-red-600 hover:underline font-medium disabled:opacity-40">
                            {busy ? '…' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                // Riders
                users.map((u: any) => {
                  const id   = u._id ?? u.id;
                  const busy = actionId === id;
                  return (
                    <tr key={id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                        {u?.user?.name || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {u?.user?.email || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {u?.user?.phone ? String(u.user.phone) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {u?.operatingArea?.join(', ') || '—'}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 font-medium">
                          {u?.rank || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge user={u} /></td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {isSuspendedOrInactive(u) ? (
                          <button disabled={busy} onClick={() => handleActivate(id)}
                            className="text-[#1a3f1c] hover:underline font-medium disabled:opacity-40">
                            {busy ? '…' : 'Activate'}
                          </button>
                        ) : (
                          <button disabled={busy} onClick={() => handleSuspend(id)}
                            className="text-red-600 hover:underline font-medium disabled:opacity-40">
                            {busy ? '…' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
