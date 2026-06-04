'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promoService } from '@/lib/api/services/promo.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight, Clock, Calendar, Edit2 } from 'lucide-react';
import Pagination from '@/components/Pagination';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active:           { label: 'Active',           className: 'bg-green-100 text-green-700' },
  inactive:         { label: 'Inactive',         className: 'bg-gray-100 text-gray-600' },
  pending_approval: { label: 'Pending Approval', className: 'bg-amber-100 text-amber-700' },
  declined:         { label: 'Declined',         className: 'bg-red-100 text-red-700' },
};

export default function PromosPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<any | null>(null);
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formData, setFormData] = useState<any>({
    name: '',
    eventName: '',
    code: '',
    validUntil: '',
    type: 'percentage',
    value: '',
    usageLimit: '100',
    maxUsesPerUser: '1',
    minOrderValue: '0',
    applicableTo: 'all',
  });
  const [isDateConfirmed, setIsDateConfirmed] = useState(false);

  const { data: allPromos = [], isLoading } = useQuery({
    queryKey: ['promos'],
    queryFn: async () => {
      const res: any = await promoService.getAllPromos();
      return (
        Array.isArray(res) ? res :
        Array.isArray(res?.data) ? res.data :
        Array.isArray(res?.promos) ? res.promos :
        []
      ) as any[];
    }
  });

  const totalPages  = Math.max(1, Math.ceil(allPromos.length / pageSize));
  const promos      = allPromos.slice((page - 1) * pageSize, page * pageSize);

  const createMutation = useMutation({
    mutationFn: (data: any) => promoService.createPromo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promos'] });
      toast.success('Promo submitted for Admin approval');
      setIsDialogOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Failed to create promo')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => promoService.updatePromo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promos'] });
      toast.success('Promo updated successfully');
      setIsDialogOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update promo')
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => promoService.togglePromo(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['promos'] }); toast.success('Status toggled'); },
    onError: (err: any) => toast.error(err.message || 'Failed to toggle status')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => promoService.deletePromo(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['promos'] }); toast.success('Promo deleted'); },
    onError: (err: any) => toast.error(err.message || 'Failed to delete promo')
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      ...formData,
      value:          Number(formData.value),
      usageLimit:     Number(formData.usageLimit),
      maxUsesPerUser: Number(formData.maxUsesPerUser),
      minOrderValue:  Number(formData.minOrderValue),
      startsAt:       new Date().toISOString(), // Default to now
    };

    if (selectedPromo) {
      updateMutation.mutate({ id: selectedPromo.id || selectedPromo._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const syncForm = (promo: any | null) => {
    if (promo) {
      setFormData({
        name:           promo.name || '',
        eventName:      promo.eventName || '',
        code:           promo.code || '',
        validUntil:     promo.validUntil ? new Date(promo.validUntil).toISOString().slice(0, 16) : '',
        type:           promo.type || promo.discountType || 'percentage',
        value:          promo.value || promo.discountValue || '',
        usageLimit:     promo.usageLimit || promo.maxTotalUses || '100',
        maxUsesPerUser: promo.maxUsesPerUser || '1',
        minOrderValue:  promo.minOrderValue || '0',
        applicableTo:   promo.applicableTo || 'all',
      });
      setIsDateConfirmed(!!promo.validUntil);
    } else {
      setFormData({
        name: '', eventName: '', code: '', validUntil: '',
        type: 'percentage', value: '', usageLimit: '100',
        maxUsesPerUser: '1', minOrderValue: '0', applicableTo: 'all',
      });
      setIsDateConfirmed(false);
    }
  };

  const openCreate = () => {
    setSelectedPromo(null);
    syncForm(null);
    setIsDialogOpen(true);
  };

  const openEdit = (promo: any) => {
    setSelectedPromo(promo);
    syncForm(promo);
    setIsDialogOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const inputCls = "bg-gray-50 border-gray-200 focus:border-[#1A3F1C] h-9 text-sm";
  const labelCls = "text-xs font-semibold text-gray-600 uppercase tracking-wide";

  return (
    <div className="w-full space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3F1C]">Promo Codes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage discount codes (require Admin approval)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-[#1A3F1C] hover:bg-[#1A3F1C]/90 gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Create Promo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#1A3F1C]" />
                <DialogTitle className="text-[#1A3F1C]">
                  {selectedPromo ? 'Edit Promo Code' : 'Create New Promo Code'}
                </DialogTitle>
              </div>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="name" className={labelCls}>Promo Name</Label>
                  <Input id="name" name="name" required value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="e.g. Summer Special" className={inputCls} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="eventName" className={labelCls}>Event Name</Label>
                  <Input id="eventName" name="eventName" value={formData.eventName} onChange={(e) => handleInputChange('eventName', e.target.value)} placeholder="e.g. Christmas" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="code" className={labelCls}>Promo Code</Label>
                  <Input id="code" name="code" required value={formData.code} onChange={(e) => handleInputChange('code', e.target.value)} placeholder="SUMMER20" className={`${inputCls} uppercase font-mono tracking-widest`} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="validUntil" className={labelCls}>Valid Until</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="validUntil" 
                      name="validUntil" 
                      type="datetime-local" 
                      required 
                      value={formData.validUntil}
                      onChange={(e) => {
                        handleInputChange('validUntil', e.target.value);
                        setIsDateConfirmed(false);
                      }}
                      className={`${inputCls} flex-1 ${isDateConfirmed ? 'border-green-500 bg-green-50' : ''}`} 
                    />
                    <Button 
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (formData.validUntil) {
                          setIsDateConfirmed(true);
                          toast.success("Date confirmed");
                        }
                      }}
                      className={`h-9 px-3 ${isDateConfirmed ? 'bg-green-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {isDateConfirmed ? 'OK' : 'OK'}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="type" className={labelCls}>Discount Type</Label>
                  <select id="type" name="type" required value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3F1C]/30 focus:border-[#1A3F1C] transition">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount (₦)</option>
                  </select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="value" className={labelCls}>Value</Label>
                  <Input id="value" name="value" type="number" step="0.01" required value={formData.value} onChange={(e) => handleInputChange('value', e.target.value)} placeholder="20" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="usageLimit" className={labelCls}>Max Total Uses</Label>
                  <Input id="usageLimit" name="usageLimit" type="number" required value={formData.usageLimit} onChange={(e) => handleInputChange('usageLimit', e.target.value)} placeholder="100" className={inputCls} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="maxUsesPerUser" className={labelCls}>Per User Limit</Label>
                  <Input id="maxUsesPerUser" name="maxUsesPerUser" type="number" required value={formData.maxUsesPerUser} onChange={(e) => handleInputChange('maxUsesPerUser', e.target.value)} placeholder="1" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="minOrderValue" className={labelCls}>Min Order (₦)</Label>
                  <Input id="minOrderValue" name="minOrderValue" type="number" step="0.01" required value={formData.minOrderValue} onChange={(e) => handleInputChange('minOrderValue', e.target.value)} placeholder="500" className={inputCls} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="applicableTo" className={labelCls}>Applicable To</Label>
                  <select id="applicableTo" name="applicableTo" required value={formData.applicableTo}
                    onChange={(e) => handleInputChange('applicableTo', e.target.value)}
                    className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3F1C]/30 focus:border-[#1A3F1C] transition">
                    <option value="all">Entire Order</option>
                    <option value="combo">Combo Meals Only</option>
                  </select>
                </div>
              </div>

              {!selectedPromo && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[10px] text-amber-700 space-y-1">
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Promo codes require SuperAdmin approval before going live.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Tag className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span><b>Tip:</b> For Combo-only promos, set value to <b>16.67%</b> to correctly reverse the platform markup.</span>
                  </div>
                </div>
              )}

              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full bg-[#1A3F1C] hover:bg-[#1A3F1C]/90 gap-2">
                <Tag className="w-4 h-4" />
                {selectedPromo 
                  ? (updateMutation.isPending ? 'Updating...' : 'Update Promo Code')
                  : (createMutation.isPending ? 'Submitting...' : 'Submit for Approval')
                }
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : promos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
            <Tag className="w-12 h-12 opacity-20" />
            <p className="text-sm font-medium">No promo codes found</p>
            <p className="text-xs">Create your first promo using the button above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Event</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Discount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Min Order</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Valid Until</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Usage</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Uses</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {promos.map((promo: any) => {
                  const status = promo.status || (promo.isActive !== false ? 'active' : 'inactive');
                  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.inactive;
                  return (
                    <tr key={promo.id || promo._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-[#1A3F1C] bg-[#1A3F1C]/5 px-2 py-0.5 rounded text-xs tracking-wider">
                          {promo.code}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 text-xs">{promo.eventName || '—'}</td>
                      <td className="px-4 py-3.5 font-semibold text-gray-800">
                        {promo.type === 'percentage' ? `${promo.value}%` : `₦${promo.value}`}
                        <span className="text-xs text-gray-400 font-normal ml-1 capitalize">({promo.type})</span>
                        <div className="text-[10px] text-[#1A3F1C] font-normal uppercase">
                          Applies to: {promo.applicableTo || 'all'}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 text-xs">₦{promo.minOrderValue}</td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {promo.validUntil
                          ? <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(promo.validUntil).toLocaleDateString()}</span>
                          : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {promo.maxUsesPerUser}/user
                        <span className="text-gray-300 mx-1">·</span>
                        {promo.usageLimit || promo.maxTotalUses} total
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs font-semibold">
                        {promo.uniqueUsersCount || 0} users
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCfg.className}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost" size="sm"
                            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => openEdit(promo)}
                            title="Edit promo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost" size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-[#1A3F1C] hover:bg-[#1A3F1C]/5"
                            onClick={() => toggleMutation.mutate(promo.id || promo._id)}
                            disabled={toggleMutation.isPending}
                            title="Toggle status"
                          >
                            {promo.isActive !== false
                              ? <ToggleRight className="w-4 h-4 text-green-500" />
                              : <ToggleLeft className="w-4 h-4 text-gray-400" />
                            }
                          </Button>
                          <Button
                            variant="ghost" size="sm"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => {
                              if (confirm('Delete this promo code?')) {
                                deleteMutation.mutate(promo.id || promo._id);
                              }
                            }}
                            disabled={deleteMutation.isPending}
                            title="Delete promo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isLoading && allPromos.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={s => { setPageSize(s); setPage(1); }}
        />
      )}
    </div>
  );
}
