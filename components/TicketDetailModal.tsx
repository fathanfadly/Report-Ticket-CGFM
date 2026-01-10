import React from 'react';
import { X, Edit2, Calendar, Clock, AlertCircle, CheckCircle, Tag } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header Image */}
                <div className="relative h-64 w-full bg-gray-100">
                    {ticket.image_url ? (
                        <img
                            src={ticket.image_url}
                            alt={ticket.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/800x400/f3f4f6/9ca3af?text=No+Image";
                            }}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                            No Image Available
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full bg-black/20 p-2 text-white backdrop-blur-md hover:bg-black/40 transition-all"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className={clsx(
                                "px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm",
                                ticket.priority === 'P1' ? "bg-red-500 text-white" :
                                    ticket.priority === 'P2' ? "bg-orange-500 text-white" :
                                        "bg-blue-500 text-white"
                            )}>
                                {ticket.priority} Priority
                            </span>
                            <span className={clsx(
                                "px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm",
                                isCompleted ? "bg-green-500 text-white" :
                                    isBlocked ? "bg-red-600 text-white" :
                                        "bg-indigo-500 text-white"
                            )}>
                                {ticket.status}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-white line-clamp-2 leading-tight">
                            {ticket.title}
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 flex flex-col gap-6">
                        {/* Description Section */}
                        {ticket.description && (
                            <div className="rounded-2xl p-5 bg-indigo-50/50 border border-indigo-100">
                                <h4 className="font-bold uppercase text-[10px] tracking-widest text-indigo-700 mb-2">Description</h4>
                                <p className="text-sm leading-relaxed text-indigo-900 whitespace-pre-wrap">
                                    {ticket.description}
                                </p>
                            </div>
                        )}

                        {/* Status/Resolution Section */}
                        {(ticket.solution || isCompleted || isBlocked) && (
                            <div className={clsx(
                                "rounded-2xl p-5 border",
                                isCompleted ? "bg-green-50 border-green-100" :
                                    isBlocked ? "bg-red-50 border-red-100" :
                                        "bg-gray-50 border-gray-100"
                            )}>
                                <div className="flex items-center gap-2 mb-3">
                                    {isCompleted ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                                        isBlocked ? <AlertCircle className="h-5 w-5 text-red-600" /> :
                                            <Clock className="h-5 w-5 text-gray-600" />}
                                    <h4 className={clsx(
                                        "font-bold uppercase text-xs tracking-widest",
                                        isCompleted ? "text-green-700" : isBlocked ? "text-red-700" : "text-gray-700"
                                    )}>
                                        {isCompleted ? "Resolution Details" : isBlocked ? "Blocking Reason" : "Current Progress"}
                                    </h4>
                                </div>
                                <p className={clsx(
                                    "text-sm leading-relaxed",
                                    isCompleted ? "text-green-900" : isBlocked ? "text-red-900" : "text-gray-900"
                                )}>
                                    {ticket.solution || "This ticket is currently in progress and hasn't reached a terminal state yet."}
                                </p>
                            </div>
                        )}

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                                <Calendar className="h-5 w-5 text-indigo-500 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Created At</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {ticket.created_at ? format(parseISO(ticket.created_at), 'MMMM d, yyyy h:mm a') : "N/A"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                                <Tag className="h-5 w-5 text-purple-500 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Ticket ID</p>
                                    <p className="text-sm font-medium text-gray-700">{ticket.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Actions */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => onEdit(ticket)}
                            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Edit2 className="h-4 w-4" />
                            Update Ticket
                        </button>

                        <div className="rounded-2xl bg-gray-50 p-6 flex flex-col gap-4">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Ticket Tags</h5>
                            <div className="flex flex-wrap gap-2">
                                {ticket.tags && Array.isArray(ticket.tags) && ticket.tags.length > 0 ? (
                                    ticket.tags.map((tag: any, idx: number) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 text-[10px] font-bold rounded-lg bg-white border border-gray-100 text-gray-600 shadow-sm"
                                        >
                                            {tag.label}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-400 italic">No tags assigned</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailModal;
