"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/lib/api/services/notification.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Bell, Plus, Trash2, Users, Mail, MessageSquare, User, Search, X } from "lucide-react";
import { NotificationDetailModal } from "@/components/ui/notification-detail-modal";
import Pagination from "@/components/Pagination";

const AUDIENCE_COLORS: Record<string, string> = {
  All: "bg-gray-100 text-gray-700",
  Customers: "bg-pink-100 text-pink-700",
  Vendors: "bg-yellow-100 text-yellow-700",
  Riders: "bg-cyan-100 text-cyan-700",
  Operations: "bg-blue-100 text-blue-700",
  IT: "bg-indigo-100 text-indigo-700",
  Finance: "bg-emerald-100 text-emerald-700",
  Admin: "bg-purple-100 text-purple-700",
  Staff: "bg-indigo-100 text-indigo-700",
  Individual: "bg-orange-100 text-orange-700",
};

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  app: <Bell className="w-3 h-3" />,
  email: <Mail className="w-3 h-3" />,
  sms: <MessageSquare className="w-3 h-3" />,
};

type Recipient = { _id: string; type: string; name: string; email: string; phone: string };

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // form state
  const [isIndividual, setIsIndividual] = useState(false);
  const [channels, setChannels] = useState<string[]>(["app"]);
  const [recipientType, setRecipientType] = useState<string>("Customer");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Recipient[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced recipient search
  useEffect(() => {
    if (!isIndividual || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res: any = await notificationService.searchRecipients(searchQuery, recipientType);
        const results = res?.results || res?.data?.results || [];
        setSearchResults(results);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, recipientType, isIndividual]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const resetForm = () => {
    setIsIndividual(false);
    setChannels(["app"]);
    setRecipientType("Customer");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedRecipient(null);
    setShowDropdown(false);
  };

  const { data: queryData, isLoading } = useQuery({
    queryKey: ["notifications", page, pageSize],
    queryFn: () => notificationService.getAllNotifications({ page, limit: pageSize }),
  });

  const notifications: any[] = (queryData as any)?.notifications ?? [];
  const totalPages: number = (queryData as any)?.totalPages ?? 1;

  const createMutation = useMutation({
    mutationFn: (data: any) => notificationService.createBroadcast(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Broadcast sent successfully");
      setOpen(false);
      resetForm();
    },
    onError: (err: any) => toast.error(err.message || "Failed to send broadcast"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteBroadcast(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Broadcast deleted");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete broadcast"),
  });

  const toggleChannel = (ch: string) => {
    setChannels((prev) => (prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (channels.length === 0) {
      toast.error("Select at least one delivery channel");
      return;
    }
    if (isIndividual && !selectedRecipient) {
      toast.error("Search and select a recipient first");
      return;
    }

    const formData = new FormData(e.currentTarget);

    if (isIndividual) {
      createMutation.mutate({
        title: formData.get("title") as string,
        message: formData.get("message") as string,
        audience: "Individual",
        type: "general",
        sourcePortal: "Operations",
        channels,
        recipientId: selectedRecipient!._id,
        recipientType: selectedRecipient!.type,
      });
    } else {
      const audience = formData.get("audience") as string;
      createMutation.mutate({
        title: formData.get("title") as string,
        message: formData.get("message") as string,
        audience,
        type: "general",
        sourcePortal: "Operations",
        targetPortal: audience,
        channels,
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3F1C]">Broadcasts</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Send targeted notifications from the Operations portal
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#1A3F1C] hover:bg-[#1A3F1C]/90 gap-2 shadow-sm cursor-pointer">
              <Plus className="w-4 h-4" /> New Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px] bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <DialogHeader className="shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#1A3F1C]" />
                <DialogTitle className="text-[#1A3F1C]">Send Broadcast Notification</DialogTitle>
              </div>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 mt-2 overflow-y-auto flex-1 pr-1 pb-2"
            >
              {/* Targeting toggle */}
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Target
                </Label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setIsIndividual(false);
                      setSelectedRecipient(null);
                      setSearchQuery("");
                    }}
                    className={`flex-1 py-2 text-sm font-medium transition ${!isIndividual ? "bg-[#1A3F1C] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                  >
                    <Users className="w-3.5 h-3.5 inline mr-1.5" />
                    Group
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsIndividual(true)}
                    className={`flex-1 py-2 text-sm font-medium transition ${isIndividual ? "bg-[#1A3F1C] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                  >
                    <User className="w-3.5 h-3.5 inline mr-1.5" />
                    Individual
                  </button>
                </div>
              </div>

              {/* Group: audience dropdown */}
              {!isIndividual && (
                <div className="grid gap-1.5">
                  <Label
                    htmlFor="audience"
                    className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                  >
                    Audience
                  </Label>
                  <select
                    id="audience"
                    name="audience"
                    required
                    aria-label="Select audience"
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
              )}

              {/* Individual: type + search */}
              {isIndividual && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Recipient Type
                  </Label>
                  <div className="flex gap-2">
                    {(["Customer", "Vendor", "Rider"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setRecipientType(t);
                          setSelectedRecipient(null);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${recipientType === t ? "bg-[#1A3F1C] text-white border-[#1A3F1C]" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {selectedRecipient ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold text-emerald-800">
                          {selectedRecipient.name}
                        </p>
                        <p className="text-xs text-emerald-600">
                          {selectedRecipient.email || selectedRecipient.phone}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Clear recipient"
                        onClick={() => {
                          setSelectedRecipient(null);
                          setSearchQuery("");
                        }}
                        className="text-emerald-400 hover:text-emerald-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div ref={searchRef} className="relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={`Search ${recipientType.toLowerCase()} by name, email or phone...`}
                          className="pl-9 bg-gray-50 border-gray-200 focus:border-[#1A3F1C]"
                        />
                      </div>
                      {showDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {searchResults.length === 0 ? (
                            <p className="px-3 py-3 text-sm text-gray-400 text-center">
                              No {recipientType.toLowerCase()}s found
                            </p>
                          ) : (
                            searchResults.map((r) => (
                              <button
                                key={r._id}
                                type="button"
                                onClick={() => {
                                  setSelectedRecipient(r);
                                  setShowDropdown(false);
                                  setSearchQuery("");
                                }}
                                className="w-full text-left px-3 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                              >
                                <p className="text-sm font-medium text-gray-800">{r.name}</p>
                                <p className="text-xs text-gray-500">
                                  {r.email}
                                  {r.email && r.phone ? " · " : ""}
                                  {r.phone}
                                </p>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <div className="grid gap-1.5">
                <Label
                  htmlFor="title"
                  className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="Notification title..."
                  className="bg-gray-50 border-gray-200 focus:border-[#1A3F1C]"
                />
              </div>

              {/* Message */}
              <div className="grid gap-1.5">
                <Label
                  htmlFor="message"
                  className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Write your broadcast message..."
                  className="min-h-[90px] bg-gray-50 border-gray-200 focus:border-[#1A3F1C] resize-none"
                />
              </div>

              {/* Delivery channels */}
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Deliver via
                </Label>
                <div className="flex gap-3">
                  {[
                    {
                      key: "app",
                      label: "App Notification",
                      icon: <Bell className="w-3.5 h-3.5" />,
                    },
                    { key: "email", label: "Email", icon: <Mail className="w-3.5 h-3.5" /> },
                    { key: "sms", label: "SMS", icon: <MessageSquare className="w-3.5 h-3.5" /> },
                  ].map((ch) => (
                    <label
                      key={ch.key}
                      className={`flex items-center gap-2 flex-1 justify-center py-2 rounded-lg border cursor-pointer text-xs font-semibold transition select-none ${channels.includes(ch.key) ? "bg-[#1A3F1C] text-white border-[#1A3F1C]" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={channels.includes(ch.key)}
                        onChange={() => toggleChannel(ch.key)}
                      />
                      {ch.icon}
                      {ch.label}
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-[#1A3F1C] hover:bg-[#1A3F1C]/90 gap-2"
              >
                <Bell className="w-4 h-4" />
                {createMutation.isPending ? "Sending..." : "Send Broadcast"}
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Message
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Audience
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Channels
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {notifications.map((notif: any) => {
                  const notifChannels: string[] = notif.channels?.length ? notif.channels : ["app"];
                  return (
                    <tr
                      key={notif.id || notif._id}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelected(notif)}
                    >
                      <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap text-xs">
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-gray-800">{notif.title}</td>
                      <td className="px-4 py-3.5 text-gray-500 max-w-[180px]">
                        <p className="truncate">{notif.message}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${AUDIENCE_COLORS[notif.audience] || "bg-gray-100 text-gray-700"}`}
                        >
                          {notif.audience === "Individual" ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Users className="w-3 h-3" />
                          )}
                          {notif.audience === "Individual"
                            ? `${notif.recipientType || "Individual"}`
                            : notif.audience}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          {notifChannels.map((ch) => (
                            <span
                              key={ch}
                              title={ch}
                              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600"
                            >
                              {CHANNEL_ICONS[ch]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            if (confirm("Delete this broadcast?")) {
                              deleteMutation.mutate(notif.id || notif._id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />

      <NotificationDetailModal
        notification={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
