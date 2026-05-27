import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { MessageSquare, Search, Send, ChevronRight } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { SupportTicket } from '../../services/supportService';
import { supportService } from '../../services/supportService';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../../lib/apiErrors';

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-gray-100 text-gray-500',
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50, skip: 0 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await adminService.listSupportTickets(params);
      setTickets(res.data ?? (res as any).tickets ?? []);
      setTotal(res.total ?? 0);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to load tickets'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const openTicket = async (t: SupportTicket) => {
    setSelected(t);
    try {
      setDetailLoading(true);
      const full = await adminService.getSupportTicket(t.id);
      setSelected(full);
    } catch {
      // keep the list version
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages]);

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    try {
      setSending(true);
      await supportService.addMessage(selected.id, reply);
      toast.success('Reply sent');
      setReply('');
      // Reload detail
      const full = await adminService.getSupportTicket(selected.id);
      setSelected(full);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to send reply'));
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (status: string) => {
    if (!selected) return;
    try {
      await adminService.updateTicketStatus(selected.id, status);
      toast.success('Status updated');
      setSelected((prev) => prev ? { ...prev, status } : prev);
      setTickets((prev) => prev.map((t) => t.id === selected.id ? { ...t, status } : t));
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update status'));
    }
  };

  const filtered = tickets.filter((t) =>
    !search || t.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-130px)]">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-gray-500 mt-1">Manage and respond to customer support requests</p>
        </div>

        <div className="flex flex-1 gap-4 min-h-0">
          {/* Ticket list */}
          <div className="w-80 flex-shrink-0 flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Loading…</div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-gray-400 gap-2">
                  <MessageSquare size={28} />
                  <p className="text-sm">No tickets found</p>
                </div>
              ) : filtered.map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => openTicket(t)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${selected?.id === t.id ? 'border-primary/50 bg-primary/5' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="text-sm font-medium line-clamp-1 flex-1">{t.subject}</p>
                    <ChevronRight size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[t.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {t.status.replace('_', ' ')}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[t.priority] ?? 'bg-gray-100 text-gray-500'}`}>
                      {t.priority}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">{fmt(t.created_at)}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Detail pane */}
          <div className="flex-1 flex flex-col min-h-0">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 bg-gray-50 rounded-2xl border border-dashed">
                <MessageSquare size={40} />
                <p className="text-sm">Select a ticket to view and reply</p>
              </div>
            ) : (
              <Card className="flex-1 flex flex-col min-h-0">
                <CardHeader className="pb-3 flex-shrink-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base line-clamp-1">{selected.subject}</CardTitle>
                      <p className="text-xs text-gray-400 mt-0.5">#{selected.id.slice(-8)} · {selected.category} · {fmt(selected.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Select value={selected.status} onValueChange={updateStatus}>
                        <SelectTrigger className="h-7 text-xs w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col min-h-0 pt-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                    {detailLoading ? (
                      <div className="text-center py-8 text-gray-400 text-sm">Loading messages…</div>
                    ) : (selected.messages ?? []).length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">No messages yet</p>
                    ) : (selected.messages ?? []).map((msg) => (
                      <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.is_admin ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.is_admin ? 'text-primary-foreground/60' : 'text-gray-400'}`}>{fmt(msg.created_at)}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Reply box */}
                  {selected.status !== 'closed' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <Textarea
                        placeholder="Type your reply…"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendReply(); }}
                        rows={2}
                        className="resize-none flex-1"
                      />
                      <Button onClick={sendReply} disabled={sending || !reply.trim()} className="self-end">
                        <Send size={14} className="mr-1.5" />{sending ? 'Sending…' : 'Reply'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
