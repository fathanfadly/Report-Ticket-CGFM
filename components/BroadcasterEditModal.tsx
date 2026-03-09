"use client";

import React, { useState, useEffect } from 'react';
import { X, User, Shield, Lock } from 'lucide-react';

interface Broadcaster {
    id: number;
    broadcaster_code: string;
    broadcaster_name: string;
}

interface BroadcasterEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, data: any) => void;
    broadcaster: Broadcaster | null;
}

const InputField = ({ label, value, onChange, type = "text", placeholder = "", required = false }: any) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none block ml-1">{label}</label>
        <input
            type={type}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
        />
    </div>
);

const BroadcasterEditModal = ({ isOpen, onClose, onSave, broadcaster }: BroadcasterEditModalProps) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (broadcaster) {
            setCode(broadcaster.broadcaster_code || '');
            setName(broadcaster.broadcaster_name || '');
            setPassword(''); // Don't show password on edit
        } else {
            setCode('');
            setName('');
            setPassword('');
        }
    }, [broadcaster, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(broadcaster?.id || 0, {
            broadcaster_code: code,
            broadcaster_name: name,
            password: password
        });
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            {broadcaster ? 'Edit Broadcaster' : 'Add Broadcaster'}
                        </h2>
                        <p className="text-sm text-gray-400 font-medium">Authentication Information</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2.5 hover:bg-gray-100 text-gray-400 transition-all">
                        <X className="h-6 w-6" />
                    </button>
                </header>

                {/* Form Content */}
                <form id="broadcaster-form" onSubmit={handleSubmit} className="flex-1 p-8 bg-slate-50/20 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                            <Shield className="h-5 w-5 text-indigo-600" />
                            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Credentials</span>
                        </div>

                        <InputField
                            label="Broadcaster Code"
                            value={code}
                            onChange={setCode}
                            required
                            placeholder="e.g. RN"
                        />

                        <InputField
                            label="Full Name"
                            value={name}
                            onChange={setName}
                            required
                            placeholder="e.g. Raffi Naufal"
                        />

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none block ml-1">
                                {broadcaster ? 'New Password (Optional)' : 'Password'}
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required={!broadcaster}
                                    placeholder={broadcaster ? "Leave blank to keep current" : "Set login password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 pl-10 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                />
                                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <footer className="flex h-20 items-center justify-end gap-3 border-t border-gray-100 bg-white px-8 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="broadcaster-form"
                        disabled={isSaving}
                        className="px-10 py-2.5 rounded-xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
                    >
                        {isSaving ? 'SAVING...' : broadcaster ? 'UPDATE' : 'CREATE'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default BroadcasterEditModal;
