// components/ShareModal.tsx
import React, { useState } from 'react';
import { X, Copy, Check, Mail, Link as LinkIcon, MessageCircle, Twitter } from 'lucide-react';
import { clsx } from 'clsx';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: string;
    title: string;
}

export const ShareModal = ({ isOpen, onClose, ticketId, title }: ShareModalProps) => {
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/tickets/${ticketId}`;
    
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };
    
    const handleShareViaEmail = async () => {
        if (!email) return;
        
        setIsSending(true);
        try {
            const response = await fetch('/api/tickets/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    ticketId,
                    shareUrl,
                    title
                }),
            });
            
            if (response.ok) {
                setEmail('');
                onClose();
                // Tampilkan notifikasi sukses
            }
        } catch (error) {
            console.error('Failed to send email:', error);
        } finally {
            setIsSending(false);
        }
    };
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Bagikan Laporan</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Link Section */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                            Link Laporan
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 truncate">
                                {shareUrl}
                            </div>
                            <button
                                onClick={handleCopyLink}
                                className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    
                    {/* Share via Apps */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
                            Bagikan via
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            <button
                                onClick={() => window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`)}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="p-2 bg-blue-50 rounded-full">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <span className="text-xs text-gray-600">Email</span>
                            </button>
                            
                            <button
                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${shareUrl}`)}`)}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="p-2 bg-green-50 rounded-full">
                                    <MessageCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <span className="text-xs text-gray-600">WhatsApp</span>
                            </button>
                            
                            <button
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`)}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="p-2 bg-sky-50 rounded-full">
                                    <Twitter className="h-5 w-5 text-sky-600" />
                                </div>
                                <span className="text-xs text-gray-600">Twitter</span>
                            </button>
                            
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: title,
                                            text: `Lihat laporan: ${title}`,
                                            url: shareUrl,
                                        });
                                    } else {
                                        handleCopyLink();
                                    }
                                }}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="p-2 bg-purple-50 rounded-full">
                                    <LinkIcon className="h-5 w-5 text-purple-600" />
                                </div>
                                <span className="text-xs text-gray-600">Lainnya</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Share via Email Form */}
                    <div className="border-t border-gray-100 pt-4">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                            Kirim ke Email
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={handleShareViaEmail}
                                disabled={!email || isSending}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                {isSending ? 'Mengirim...' : 'Kirim'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};