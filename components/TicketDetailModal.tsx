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
                                    "bg-pink-100 text-pink-600"
                        )}>
                            {ticket.status.replace(/^./, (str: string) => str.toUpperCase())}
                        </span>
                        <span className="text-gray-400 font-medium text-sm">#{ticket.id.slice(0, 8)}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        {ticket.title}
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content (Left) */}
                        <div className="lg:col-span-8 flex flex-col gap-8">
                            {/* Description Section */}
                            <section>
                                <h4 className="text-sm font-semibold text-gray-700 mb-4">Description</h4>
                                <div className="rounded-xl p-6 bg-slate-50/50 border border-slate-100 min-h-[150px]">
                                    <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                                        {ticket.description || "No description provided."}
                                    </p>
                                </div>
                            </section>

                            {/* Attachments Section */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700">Attachments</h4>
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                                        <Paperclip className="h-3.5 w-3.5" />
                                        Upload Files
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-sm group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-gray-50 text-gray-400">
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">attachment_1.pdf</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
                                                <Download className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Comments Section */}
                            <section className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-700">Comments & Activity</h4>
                                    <button className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        Hide Details
                                    </button>
                                </div>

                                <div className="relative">
                                    <textarea
                                        placeholder="Add a comment... (Use @ to tag users)"
                                        className="w-full rounded-xl border border-gray-200 p-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none resize-none bg-slate-50/30"
                                        rows={3}
                                    />
                                    <button className="absolute right-3 bottom-3 p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors">
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4 mt-2">
                                    <div className="flex gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">D</div>
                                        <div className="flex-1 flex flex-col gap-1 p-4 rounded-xl border border-gray-100 bg-white">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-gray-900">Dio</span>
                                                <span className="text-[10px] text-gray-400">08/01/2026, 16.06.47</span>
                                            </div>
                                            <p className="text-sm text-gray-600">code updated. waiting for deployment</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar (Right) */}
                        <div className="lg:col-span-4 flex flex-col gap-6 border-l border-gray-50 pl-8">
                            <div className="space-y-6">
                                {/* Status Dropdown Mock */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Status</label>
                                    <div className="flex items-center justify-between px-4 py-2 rounded-xl border border-gray-100 bg-white text-sm text-gray-700 cursor-pointer hover:border-gray-300 transition-colors group">
                                        <span className="font-medium">{ticket.status.replace(/^./, (str: string) => str.toUpperCase())}</span>
                                        <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                    </div>
                                </div>

                                {/* Assigned To Mock */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Assigned To</label>
                                    <div className="flex items-center justify-between px-4 py-2 rounded-xl border border-gray-100 bg-white text-sm text-gray-700 cursor-pointer hover:border-gray-300 transition-colors group">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">D</div>
                                            <span className="font-medium">Dio</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                    </div>
                                </div>

                                {/* Priority Mock */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Priority</label>
                                    <div className="flex items-center justify-between px-4 py-2 rounded-xl border border-indigo-100 bg-indigo-50/30 text-sm text-indigo-700 cursor-pointer hover:border-indigo-300 transition-colors group">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                            <span className="font-medium">{ticket.priority === 'P1' ? 'High' : ticket.priority === 'P2' ? 'Medium' : 'Low'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Update Button */}
                                <button
                                    onClick={() => onEdit(ticket)}
                                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#6366f1] py-4 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-[#4f46e5] transition-all hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Update
                                </button>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Reporter Information */}
                            <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-4">Reporter Information</h5>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                            <User className="h-3 w-3 text-gray-400" />
                                        </div>
                                        <span className="font-medium">Jack</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-50 border border-slate-200 text-slate-600 uppercase">DBS</span>
                                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-50 border border-slate-200 text-slate-600 uppercase">PayNow</span>
                                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-50 border border-slate-200 text-slate-600 uppercase">RD</span>
                                        <span className="text-[10px] font-bold text-gray-400">+2</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Timeline */}
                            <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-4">Timeline</h5>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-1">Created</span>
                                            <span className="text-[11px] font-medium text-gray-600">
                                                {ticket.created_at ? format(parseISO(ticket.created_at), 'MMM d, yyyy h:mm aa') : "Nov 10, 2025 1:34 PM"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-1">Updated</span>
                                            <span className="text-[11px] font-medium text-gray-600">
                                                {ticket.updated_at ? format(parseISO(ticket.updated_at), 'MMM d, yyyy h:mm aa') : "Jan 7, 2026 11:49 AM"}
                                            </span>
                                        </div>
                                    </div>
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
