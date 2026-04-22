// components/TicketDetailModal.tsx
import React, { useState, useEffect } from 'react';
import { Share2, Edit2, Calendar, Clock, Tag, User, Send, CheckCircle, AlertCircle, MessageSquare, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { clsx } from 'clsx';
import { ShareModal } from './ShareModal';

// Type definitions
interface Ticket {
    id: string;
    judul_laporan?: string;
    title?: string;
    status: string;
    priority?: string;
    description?: string;
    solution?: string;
    image_url?: string;
    kode_broadcaster?: string;
    kategori_laporan?: string;
    sumber_laporan?: string;
    nama_pelapor?: string;
    tipe_pelapor?: string;
    no_hp?: string;
    nomor_telepon?: string;
    pekerjaan?: string;
    alamat?: string;
    created_at?: string;
    updated_at?: string;
}

interface Activity {
    id: string;
    content: string;
    ticket_status?: string;
    created_at: string;
}

interface TicketDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: Ticket | null;
    onEdit: (ticket: Ticket) => void;
    onCommentAdded?: (ticketId: string, lastComment: string, commentCount: number) => void;
}

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ 
    isOpen, 
    onClose, 
    ticket, 
    onEdit, 
    onCommentAdded 
}) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [showCopyFeedback, setShowCopyFeedback] = useState(false);

    useEffect(() => {
        if (isOpen && ticket?.id) {
            fetchActivities();
        }
    }, [isOpen, ticket?.id]);

    const fetchActivities = async () => {
        if (!ticket?.id) return;
        setIsLoading(true);
        try {
            const response = await fetch(`/api/tickets/${ticket.id}/activities`);
            if (response.ok) {
                const data = await response.json();
                setActivities(data);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim() || isSending || !ticket?.id) return;

        setIsSending(true);
        try {
            const response = await fetch(`/api/tickets/${ticket.id}/activities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment,
                    ticket_status: ticket.status
                }),
            });

            if (response.ok) {
                const addedActivity = await response.json();
                setActivities([addedActivity, ...activities]);
                setNewComment('');

                if (onCommentAdded && ticket.id) {
                    onCommentAdded(ticket.id, addedActivity.content, activities.length + 1);
                }
            }
        } catch (error) {
            console.error('Error sending comment:', error);
        } finally {
            setIsSending(false);
        }
    };

    // Handle share dengan fallback
    const handleShareClick = () => {
        // Cek apakah browser support Web Share API (mobile)
        if (navigator.share && window.innerWidth <= 768) {
            navigator.share({
                title: ticket?.judul_laporan || ticket?.title || 'Laporan Tiket',
                text: `Lihat laporan: ${ticket?.judul_laporan || ticket?.title}`,
                url: `${window.location.origin}/tickets/${ticket?.id}`,
            }).catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                    // Fallback ke modal
                    setIsShareModalOpen(true);
                }
            });
        } else {
            // Desktop: buka modal share
            setIsShareModalOpen(true);
        }
    };

    if (!isOpen || !ticket) return null;

    const isCompleted = ticket.status === 'completed';
    const isBlocked = ticket.status === 'blocked';

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 overflow-y-auto">
                <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
                    {/* Header Actions */}
                    <div className="flex justify-end items-center p-4 gap-2 border-b border-gray-50">
                        <div className="relative">
                            <button 
                                onClick={handleShareClick}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 border border-gray-200 transition-colors relative group"
                                aria-label="Share ticket"
                            >
                                <Share2 className="h-5 w-5" />
                                {showCopyFeedback && (
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap animate-in fade-in duration-200">
                                        Link tersalin!
                                    </span>
                                )}
                            </button>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="p-8">
                        {/* Top Info */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className={clsx(
                                "px-3 py-1 text-xs font-semibold rounded-full",
                                isCompleted ? "bg-green-100 text-green-700" :
                                    isBlocked ? "bg-red-100 text-red-700" :
                                        "bg-indigo-100 text-indigo-600"
                            )}>
                                {ticket.status.replace(/^./, (str: string) => str.toUpperCase())}
                            </span>
                            <span className="text-gray-400 font-medium text-sm">#{ticket.id.slice(0, 8)}</span>
                            {ticket.kode_broadcaster && (
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600 uppercase tracking-tight">
                                    BC: {ticket.kode_broadcaster}
                                </span>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            {ticket.judul_laporan || ticket.title}
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Main Content (Left) */}
                            <div className="lg:col-span-8 flex flex-col gap-8">
                                {/* Description Section */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700">Laporan / Deskripsi</h4>
                                        {ticket.kategori_laporan && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100 rounded-md uppercase">
                                                {ticket.kategori_laporan}
                                            </span>
                                        )}
                                    </div>
                                    <div className="rounded-xl p-6 bg-slate-50/50 border border-slate-100 min-h-[150px]">
                                        <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                                            {ticket.description || "No description provided."}
                                        </p>
                                    </div>
                                </section>

                                {/* Attachments Section */}
                                {ticket.image_url && (
                                    <section>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-4">Attachment</h4>
                                        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm max-w-md">
                                            <img src={ticket.image_url} alt="Attachment" className="w-full h-auto object-cover" />
                                        </div>
                                    </section>
                                )}

                                {/* Comments Section */}
                                <section className="flex flex-col gap-4">
                                    <h4 className="text-sm font-semibold text-gray-700">Aktivitas Laporan</h4>

                                    {/* Comment Input */}
                                    <div className="relative">
                                        <textarea
                                            placeholder="Add a comment..."
                                            className="w-full rounded-xl border border-gray-200 p-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none resize-none bg-slate-50/30"
                                            rows={2}
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            disabled={isSending}
                                        />
                                        <button
                                            onClick={handleSendComment}
                                            disabled={isSending || !newComment.trim()}
                                            className="absolute right-3 bottom-3 p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send className={clsx("h-4 w-4", isSending && "animate-pulse")} />
                                        </button>
                                    </div>

                                    {/* Activities List */}
                                    <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                                        {isLoading ? (
                                            <div className="flex justify-center p-4">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Highlighted Reason/Solution at Top */}
                                                {ticket.solution && (
                                                    <div className={clsx(
                                                        "flex gap-3 p-4 rounded-2xl border animate-in slide-in-from-top-4 duration-500 shadow-sm mb-2",
                                                        ticket.status === 'completed'
                                                            ? "bg-green-50/50 border-green-100 ring-4 ring-green-50/20"
                                                            : "bg-red-50/50 border-red-100 ring-4 ring-red-50/20"
                                                    )}>
                                                        <div className="shrink-0">
                                                            <div className={clsx(
                                                                "h-10 w-10 rounded-full flex items-center justify-center shadow-sm",
                                                                ticket.status === 'completed' ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                                            )}>
                                                                {ticket.status === 'completed' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1 flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className={clsx(
                                                                    "text-[10px] font-black uppercase tracking-widest",
                                                                    ticket.status === 'completed' ? "text-green-600" : "text-red-600"
                                                                )}>
                                                                    {ticket.status === 'completed' ? "Official Resolution" : "Status Blocked Result"}
                                                                </span>
                                                                {ticket.updated_at && (
                                                                    <span className="text-[10px] text-gray-400 font-medium bg-white/80 px-2 py-0.5 rounded-full border border-gray-100">
                                                                        {format(parseISO(ticket.updated_at), 'MMM d, h:mm aa')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={clsx(
                                                                "text-sm font-bold leading-relaxed",
                                                                ticket.status === 'completed' ? "text-green-900" : "text-red-900"
                                                            )}>
                                                                {ticket.solution}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {activities.length > 0 ? (
                                                    activities.map((activity) => (
                                                        <div key={activity.id} className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                            <div className="shrink-0 mt-1">
                                                                <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                                                                    <MessageSquare className="h-4 w-4" />
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col gap-1 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-bold text-gray-700">Sistem / Admin</span>
                                                                    {activity.ticket_status && (
                                                                        <span className={clsx(
                                                                            "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                                                                            activity.ticket_status === 'urgent' ? "bg-red-50 text-red-600 border border-red-100" :
                                                                                activity.ticket_status === 'new' ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                                                                                    activity.ticket_status === 'assessment' ? "bg-purple-50 text-purple-600 border border-purple-100" :
                                                                                        activity.ticket_status === 'backlog' ? "bg-slate-100 text-slate-600 border border-slate-200" :
                                                                                            activity.ticket_status === 'progress' ? "bg-pink-50 text-pink-600 border border-pink-100" :
                                                                                                activity.ticket_status === 'pending' ? "bg-yellow-50 text-yellow-600 border border-yellow-200" :
                                                                                                    activity.ticket_status === 'completed' ? "bg-green-50 text-green-600 border border-green-100" :
                                                                                                        activity.ticket_status === 'blocked' ? "bg-red-50 text-red-600 border border-red-100" :
                                                                                                            "bg-gray-50 text-gray-600 border border-gray-100"
                                                                        )}>
                                                                            {activity.ticket_status === 'urgent' ? 'Urgent' :
                                                                                activity.ticket_status === 'new' ? 'New/ Open' :
                                                                                    activity.ticket_status === 'assessment' ? 'Assessment' :
                                                                                        activity.ticket_status === 'backlog' ? 'Backlog' :
                                                                                            activity.ticket_status === 'progress' ? 'In Progress' :
                                                                                                activity.ticket_status === 'pending' ? 'Pending Input' :
                                                                                                    activity.ticket_status}
                                                                        </span>
                                                                    )}
                                                                    <span className="text-[10px] text-gray-400 font-medium ml-auto">
                                                                        {format(parseISO(activity.created_at), 'MMM d, h:mm aa')}
                                                                    </span>
                                                                </div>
                                                                <div className="rounded-2xl rounded-tl-none bg-white border border-gray-100 p-3 shadow-sm">
                                                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                                                        {activity.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    !ticket.solution && (
                                                        <div className="text-center py-8 text-gray-400">
                                                            <p className="text-sm">Belum ada aktivitas.</p>
                                                        </div>
                                                    )
                                                )}
                                            </>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Sidebar (Right) */}
                            <div className="lg:col-span-4 flex flex-col gap-6 border-l border-gray-50 pl-8">
                                <div className="space-y-6">
                                    {/* Status */}
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Status</label>
                                        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-white text-sm text-gray-700 font-medium capitalize">
                                            {ticket.status}
                                        </div>
                                    </div>

                                    {/* Source */}
                                    {ticket.sumber_laporan && (
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Sumber Laporan</label>
                                            <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-white text-sm text-gray-700 font-medium">
                                                {ticket.sumber_laporan}
                                            </div>
                                        </div>
                                    )}

                                    {/* Priority */}
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Priority</label>
                                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-indigo-100 bg-indigo-50/30 text-sm text-indigo-700 font-bold">
                                            <div className={clsx(
                                                "h-2 w-2 rounded-full",
                                                ticket.priority === 'P1' ? "bg-red-500" : ticket.priority === 'P2' ? "bg-orange-400" : "bg-blue-400"
                                            )} />
                                            {ticket.priority === 'P1' ? 'High' : ticket.priority === 'P2' ? 'Medium' : 'Low'}
                                        </div>
                                    </div>

                                    {/* Update Button */}
                                    <button
                                        onClick={() => onEdit(ticket)}
                                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#4f46e5] py-4 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-[1.01] active:scale-[0.99]"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Update Report
                                    </button>
                                </div>

                                <hr className="border-gray-50" />

                                {/* Reporter Information */}
                                <div>
                                    <h5 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <User className="h-4 w-4 text-indigo-500" />
                                        Informasi Pelapor
                                    </h5>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Nama Pelapor</span>
                                            <span className="text-sm font-bold text-gray-700">{ticket.nama_pelapor || "N/A"}</span>
                                            {ticket.tipe_pelapor && (
                                                <span className="mt-1 w-max px-2 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-500 rounded border border-slate-200 uppercase">
                                                    {ticket.tipe_pelapor}
                                                </span>
                                            )}
                                        </div>

                                        {(ticket.no_hp || ticket.nomor_telepon) && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Telepon</span>
                                                <span className="text-sm font-medium text-indigo-600">{ticket.no_hp || ticket.nomor_telepon}</span>
                                            </div>
                                        )}

                                        {ticket.pekerjaan && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Pekerjaan</span>
                                                <span className="text-sm text-gray-600">{ticket.pekerjaan}</span>
                                            </div>
                                        )}

                                        {ticket.alamat && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Alamat</span>
                                                <span className="text-[11px] leading-relaxed text-gray-500">{ticket.alamat}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <hr className="border-gray-50" />

                                {/* Timeline */}
                                <div>
                                    <h5 className="text-sm font-semibold text-gray-700 mb-4">Timeline</h5>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-1">Created</span>
                                                <span className="text-[11px] font-medium text-gray-600">
                                                    {ticket.created_at ? format(parseISO(ticket.created_at), 'MMM d, yyyy h:mm aa') : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                        {ticket.updated_at && (
                                            <div className="flex items-center gap-3">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-1">Last Update</span>
                                                    <span className="text-[11px] font-medium text-gray-600">
                                                        {format(parseISO(ticket.updated_at), 'MMM d, yyyy h:mm aa')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                ticketId={ticket.id}
                title={ticket.judul_laporan || ticket.title || 'Laporan Tiket'}
            />
        </>
    );
};

export default TicketDetailModal;
