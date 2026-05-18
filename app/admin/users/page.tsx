'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/dashboard/users/modal';
import { RiderModalContent } from '@/components/dashboard/users/rider-modal';
import { VendorModalContent } from '@/components/dashboard/users/vendor-modal';
import { CustomerModalContent } from '@/components/dashboard/users/customer-modal';
import { StaffModalContent } from '@/components/dashboard/users/staff-modal';
import {
  superAdminApi,
  type Customer,
  type Vendor,
  type Rider,
  type Staff,
  type PaginationParams,
} from '@/lib/api/api';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type UserType = 'riders' | 'vendors' | 'customers' | 'staff';
type TableRow = Customer | Vendor | Rider | Staff;

const ITEMS_PER_PAGE = 7;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function statusClass(status?: string) {
  if (!status) return 'text-muted-foreground';
  const s = status.toLowerCase();
  if (s === 'active') return 'text-green-600 font-medium';
  if (s === 'suspended') return 'text-red-500 font-medium';
  if (s === 'pending') return 'text-yellow-600 font-medium';
  if (s === 'deactivated') return 'text-gray-500 font-medium';
  return 'text-foreground';
}

// Derive a readable status label from whichever field the backend returns
function getStatus(row: TableRow): string {
  return (row as any).statusOfAccount ?? (row as any).status ?? '—';
}

// Controllers return `name` on vendors, but customers/riders/staff may return
// firstName + lastName from the populated user document instead
function getName(row: TableRow): string {
  if (row.name) return row.name;
  const first = (row as any).firstName ?? '';
  const last  = (row as any).lastName  ?? '';
  const full  = `${first} ${last}`.trim();
  return full || '—';
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeletons
// ─────────────────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
        <tr key={i} className="border-b border-border">
          {Array.from({ length: 6 }).map((__, j) => (
            <td key={j} className="px-6 py-4">
              <Skeleton className="h-4 w-full rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination bar
// ─────────────────────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  onChange: (p: number) => void;
}

function Pagination({ page, totalPages, total, itemsPerPage, onChange }: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const to = Math.min(page * itemsPerPage, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>
        {total === 0 ? 'No results' : `Showing ${from}–${to} of ${total}`}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | '…')[]>((acc, p, i, arr) => {
            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('…');
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === '…' ? (
              <span key={`ellipsis-${i}`} className="px-2">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onChange(p as number)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary text-foreground'
                }`}
              >
                {p}
              </button>
            )
          )}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [userType, setUserType] = useState<UserType>('riders');
  const [page, setPage] = useState(1);

  // List state
  const [rows, setRows] = useState<TableRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter state — debounced via a ref
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterAddressOrPhone, setFilterAddressOrPhone] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Debounce timer
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────

  const fetchData = useCallback(async (p: number, type: UserType, filters: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const params: PaginationParams = { page: p, limit: ITEMS_PER_PAGE, ...filters };
      let res;
      if (type === 'riders')    res = await superAdminApi.riders.getAll(params);
      else if (type === 'vendors')   res = await superAdminApi.vendors.getAll(params);
      else if (type === 'customers') res = await superAdminApi.customers.getAll(params);
      else                           res = await superAdminApi.staff.getAll(params);

      setRows(res.data ?? []);
      setTotal(res.total ?? 0);
      setTotalPages(res.pages ?? Math.ceil((res.total ?? 0) / ITEMS_PER_PAGE));
    } catch (err: any) {
      const msg = err?.message || `Failed to load ${type}`;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Active filter params
  // Controllers use isActive/isSuspended booleans, not a `status` string
  const activeFilters = useCallback((): PaginationParams => {
    const f: PaginationParams = {};
    if (filterName)  f.search = filterName;
    if (filterEmail) f.email  = filterEmail;
    if (filterAddressOrPhone) {
      if (userType === 'customers') f.address = filterAddressOrPhone;
      else f.phone = filterAddressOrPhone;
    }
    if (userType === 'staff' && filterDepartment) f.department = filterDepartment;
    if (filterStatus === 'active')      { f.isActive = true;  f.isSuspended = false; }
    if (filterStatus === 'suspended')   { f.isSuspended = true; }
    if (filterStatus === 'pending')     { f.isActive = false; f.isSuspended = false; }
    if (filterStatus === 'deactivated') { f.isActive = false; }
    return f;
  }, [filterName, filterEmail, filterAddressOrPhone, filterDepartment, filterStatus, userType]);

  // Trigger fetch when type or page changes immediately
  useEffect(() => {
    fetchData(page, userType, activeFilters());
  }, [page, userType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce filter changes to avoid spamming on every keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchData(1, userType, activeFilters());
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [filterName, filterEmail, filterAddressOrPhone, filterDepartment, filterStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset filters and page when switching user type
  const handleTypeChange = (type: UserType) => {
    setUserType(type);
    setPage(1);
    setFilterName('');
    setFilterEmail('');
    setFilterAddressOrPhone('');
    setFilterDepartment('');
    setFilterStatus('');
  };

  const handleRowClick = (row: TableRow) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  // ── Render table body ─────────────────────────────────────────────────

  const renderRows = () => {
    if (loading) return <TableSkeleton />;

    if (rows.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
            No {userType} found{filterName ? ` matching "${filterName}"` : ''}.
          </td>
        </tr>
      );
    }

    return rows.map((row, index) => (
      <tr
        key={row.id || (row as any)._id || index}
        onClick={() => handleRowClick(row)}
        className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <td className="px-6 py-4 text-foreground text-sm">
          {(page - 1) * ITEMS_PER_PAGE + index + 1}
        </td>
        <td className="px-6 py-4 text-foreground text-sm">
          <div className="flex items-center gap-3">
            {row.avatar ? (
              <img src={row.avatar} alt={getName(row)} className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                {getName(row)[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <span className="truncate max-w-[160px]">{getName(row)}</span>
          </div>
        </td>

        {userType === 'riders' && (() => {
          const r = row as Rider;
          return (
            <>
              <td className="px-6 py-4 text-sm text-foreground">{r.deliveryType ?? '—'}</td>
              <td className="px-6 py-4 text-sm text-foreground">{r.address ?? '—'}</td>
              <td className={`px-6 py-4 text-sm ${statusClass(getStatus(r))}`}>{getStatus(r)}</td>
              <td className="px-6 py-4 text-sm text-foreground">{r.totalDeliveries ?? r.totalOrders ?? '—'}</td>
            </>
          );
        })()}

        {userType === 'vendors' && (() => {
          const v = row as Vendor;
          return (
            <>
              <td className="px-6 py-4 text-sm text-foreground">{v.deliveryType ?? '—'}</td>
              <td className="px-6 py-4 text-sm text-foreground">{v.address ?? '—'}</td>
              <td className={`px-6 py-4 text-sm ${statusClass(getStatus(v))}`}>{getStatus(v)}</td>
              <td className="px-6 py-4 text-sm text-foreground">{v.totalOrders ?? '—'}</td>
            </>
          );
        })()}

        {userType === 'customers' && (() => {
          const c = row as Customer;
          return (
            <>
              <td className="px-6 py-4 text-sm text-foreground truncate max-w-[160px]">{c.email}</td>
              <td className="px-6 py-4 text-sm text-foreground">{c.address ?? '—'}</td>
              <td className={`px-6 py-4 text-sm ${statusClass(getStatus(c))}`}>{getStatus(c)}</td>
              <td className="px-6 py-4 text-sm text-foreground">{c.totalOrders ?? '—'}</td>
            </>
          );
        })()}

        {userType === 'staff' && (() => {
          const s = row as Staff;
          return (
            <>
              <td className="px-6 py-4 text-sm text-foreground truncate max-w-[160px]">{s.email}</td>
              <td className="px-6 py-4 text-sm text-foreground">{s.department ?? '—'}</td>
              <td className={`px-6 py-4 text-sm ${statusClass(getStatus(s))}`}>{getStatus(s)}</td>
              <td className="px-6 py-4 text-sm text-foreground">{s.lineManager ?? '—'}</td>
            </>
          );
        })()}
      </tr>
    ));
  };

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Users & Staff</h1>
          <select
            value={userType}
            onChange={(e) => handleTypeChange(e.target.value as UserType)}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold border border-border cursor-pointer outline-none"
          >
            <option value="riders">Riders</option>
            <option value="vendors">Vendors</option>
            <option value="customers">Customers</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Name — always visible */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <input
                type="text"
                placeholder="Search by name…"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>

            {/* Email — riders, vendors, customers */}
            {userType !== 'staff' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="text"
                  placeholder="Search by email…"
                  value={filterEmail}
                  onChange={(e) => setFilterEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
            )}

            {/* Address / Phone — riders, vendors, customers */}
            {userType !== 'staff' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {userType === 'customers' ? 'Address' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  placeholder="Search…"
                  value={filterAddressOrPhone}
                  onChange={(e) => setFilterAddressOrPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
            )}

            {/* Department — staff only */}
            {userType === 'staff' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Department</label>
                <input
                  type="text"
                  placeholder="Search by department…"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
            )}

            {/* Account status — all types */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Account Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm cursor-pointer"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                {(userType === 'vendors' || userType === 'riders') && (
                  <option value="pending">Pending</option>
                )}
                {userType === 'staff' && (
                  <option value="deactivated">Deactivated</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center justify-between gap-4">
            <p className="text-destructive text-sm font-medium">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchData(page, userType, activeFilters())}
              className="border-destructive text-destructive hover:bg-destructive/10 shrink-0"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary border-b border-border">
                  <th className="px-6 py-4 text-left font-semibold text-secondary-foreground w-14">S/N</th>
                  <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Name</th>

                  {userType === 'riders' && (
                    <>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Delivery Type</th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Address</th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Status</th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Total Deliveries</th>
                    </>
                  )}
                  {userType === 'vendors' && (
                    <>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Delivery Type</th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Address</th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Status</th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Total Orders</th>
                    </>
                  )}
                  {userType === 'customers' && (
                    <>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Email</th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Address</th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Status</th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Total Orders</th>
                    </>
                  )}
                  {userType === 'staff' && (
                    <>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Email</th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Department</th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Status</th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">Line Manager</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>{renderRows()}</tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-background px-6 py-4 border-t border-border">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              itemsPerPage={ITEMS_PER_PAGE}
              onChange={setPage}
            />
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selectedRow && (
        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedRow(null); }}>
          {userType === 'riders' && (
            <RiderModalContent
              rider={selectedRow as Rider}
              onClose={() => { setModalOpen(false); setSelectedRow(null); }}
            />
          )}
          {userType === 'vendors' && (
            <VendorModalContent
              vendor={selectedRow as Vendor}
              onClose={() => { setModalOpen(false); setSelectedRow(null); }}
            />
          )}
          {userType === 'customers' && (
            <CustomerModalContent
              customer={selectedRow as Customer}
              onClose={() => { setModalOpen(false); setSelectedRow(null); }}
            />
          )}
          {userType === 'staff' && (
            <StaffModalContent
              staff={selectedRow as Staff}
              onClose={() => { setModalOpen(false); setSelectedRow(null); }}
            />
          )}
        </Modal>
      )}
    </>
  );
}