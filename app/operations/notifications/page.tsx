'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/lib/api/services/notification.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Bell, Plus, Trash2, Users } from 'lucide-react';
import { NotificationDetailModal } from '@/components/ui/notification-detail-modal';

const AUDIENCE_COLORS: Record<string, string> = {
  All:        'bg-gray-100 text-gray-700',
  Customers:  'bg-pink-100 text-pink-700',
  Vendors:    'bg-yellow-100 text-yellow-700',
  Riders:     'bg-cyan-100 text-cyan-700',
  Operations: 'bg-blue-100 text-blue-700',
  IT:         'bg-indigo-100 text-indigo-700',
  Admin:      'bg-purple-100 text-purple-700',
  Finance:    'bg-emerald-100 text-emerald-700',
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res: any = await notificationService.getAllNotifications();
      return (
        Array.isArray(res) ? res :
        Array.isArray(res?.data) ? res.data :
        Array.isArray(res?.notifications) ? res.notifications :
        []
      ) as any[];
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => notificationService.createBroadcast(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Broadcast sent successfully');
      setOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Failed to send broadcast')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteBroadcast(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Broadcast deleted');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to delete broadcast')
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const audience = formData.get('audience') as string;
    createMutation.mutate({
      title: formData.get('title') as string,
      message: formData.get('message') as string,
      audience,
      type: 'general',
      sourcePortal: 'Operations',
      targetPortal: audience,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3F1C]">Broadcasts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Send targeted notifications from the Operations portal</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A3F1C] hover:bg-[#1A3F1C]/90 gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> New Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#1A3F1C]" />
                <DialogTitle className="text-[#1A3F1C]">Send Broadcast Notification</DialogTitle>
              </div>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid gap-1.5">
                <Label htmlFor="audience" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Audience</Label>
                <select
                  id="audience" name="audience" required
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3F1C]/30 focus:border-[#1A3F1C] transition"
                >
                  <option value="All">📢 All</option>
                  <option value="Customers">👤 Customers</option>
                  <option value="Vendors">🏪 Vendors</option>
                  <option value="Riders">🏍️ Riders</option>
                  <option value="Operations">⚙️ Operations</option>
                  <option value="IT">💻 IT</option>
                  <option value="Admin">👑 Admin</option>
                  <option value="Finance">💰 Finance</option>
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="title" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Title</Label>
                <Input id="title" name="title" required placeholder="Notification title..." className="bg-gray-50 border-gray-200 focus:border-[#1A3F1C]" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="message" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Message</Label>
                <Textarea
                  id="message" name="message" required
                  placeholder="Write your broadcast message..."
                  className="min-h-[100px] bg-gray-50 border-gray-200 focus:border-[#1A3F1C] resize-none"
                />
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="w-full bg-[#1A3F1C] hover:bg-[#1A3F1C]/90 gap-2">
                <Bell className="w-4 h-4" />
                {createMutation.isPending ? 'Sending...' : 'Send Broadcast'}
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
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
            <Bell className="w-12 h-12 opacity-20" />
            <p className="text-sm font-medium">No broadcasts yet</p>
            <p className="text-xs">Create your first broadcast using the button above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Message</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Audience</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {notifications.map((notif: any) => (
                  <tr
                    key={notif.id || notif._id}
                    className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                    onClick={() => setSelected(notif)}
                  >
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap text-xs">
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-gray-800">{notif.title}</td>
                    <td className="px-4 py-3.5 text-gray-500 max-w-[200px]">
                      <p className="truncate">{notif.message}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${AUDIENCE_COLORS[notif.audience] || 'bg-gray-100 text-gray-700'}`}>
                        <Users className="w-3 h-3" />
                        {notif.audience}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (confirm('Delete this broadcast?')) {
                            deleteMutation.mutate(notif.id || notif._id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NotificationDetailModal
        notification={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
