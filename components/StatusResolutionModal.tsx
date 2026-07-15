import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface StatusResolutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    ticketTitle: string;
    mode: 'solved' | 'blocked';
}

const StatusResolutionModal = ({ isOpen, onClose, onConfirm, ticketTitle, mode }: StatusResolutionModalProps) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) return;
        onConfirm(reason);
        setReason('');
    };

    const isSolved = mode === 'solved';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isSolved ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                            <AlertCircle className="h-6 w-6 text-red-500" />
                        )}
                        <h2 className="text-xl font-bold text-gray-900">
                            {isSolved ? 'Solve Ticket' : 'Block Ticket'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 text-gray-400">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-500">
                        {isSolved ? 'How was this resolved?' : 'Why is this blocked?'}
                    </p>
                    <p className="font-medium text-gray-800 line-clamp-1">{ticketTitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            {isSolved ? 'Solution / Reason' : 'Problem / Reason'}
                        </label>
                        <textarea
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={isSolved ? "e.g. Government already clean it up..." : "e.g. Waiting for materials / Missing documentation..."}
                            className={`w-full h-32 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-4 transition-all resize-none ${isSolved ? 'focus:border-green-500 focus:ring-green-50/50' : 'focus:border-red-500 focus:ring-red-50/50'
                                }`}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={!reason.trim()}
                            className={`flex-1 rounded-xl py-3 text-sm font-semibold text-white shadow-lg transition-all ${isSolved
                                ? 'bg-green-600 shadow-green-200 hover:bg-green-700'
                                : 'bg-red-600 shadow-red-200 hover:bg-red-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isSolved ? 'Mark as Solved' : 'Mark as Blocked'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StatusResolutionModal;
