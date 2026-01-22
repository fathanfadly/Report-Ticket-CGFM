import React from 'react';
import { X, Edit2, Calendar, Clock, Tag, Share2, Paperclip, ChevronDown, User, Send, Eye, Download } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { clsx } from 'clsx';

interface TicketDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: any;
    onEdit: (ticket: any) => void;
}

const TicketDetailModal = ({ isOpen, onClose, ticket, onEdit }: TicketDetailModalProps) => {
    if (!isOpen || !ticket) return null;

    const isCompleted = ticket.status === 'completed';
    const isBlocked = ticket.status === 'blocked';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 overflow-y-auto">
            <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
                {/* Header Actions */}
                <div className="flex justify-end items-center p-4 gap-2 border-b border-gray-50">
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 border border-gray-200 transition-colors">
                        <Share2 className="h-5 w-5" />
                    </button>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

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

                            {/* Comments Section (Simplified for now) */}
                            <section className="flex flex-col gap-4">
                                <h4 className="text-sm font-semibold text-gray-700">Aktivitas Laporan</h4>
                                <div className="relative">
                                    <textarea
                                        placeholder="Add a comment..."
                                        className="w-full rounded-xl border border-gray-200 p-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none resize-none bg-slate-50/30"
                                        rows={2}
                                    />
                                    <button className="absolute right-3 bottom-3 p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors">
                                        <Send className="h-4 w-4" />
                                    </button>
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

                                    {ticket.nomor_telepon && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Telepon</span>
                                            <span className="text-sm font-medium text-indigo-600">{ticket.nomor_telepon}</span>
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
    );
};

export default TicketDetailModal;
