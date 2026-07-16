"use client";

import React, { useState, useEffect } from 'react';
import { X, Lock, Shield, LayoutDashboard, Home, Users, Radio, Bell, CheckSquare, Square } from 'lucide-react';

// --- Types ---
interface Broadcaster {
    id: number;
    broadcaster_code: string;
    broadcaster_name: string;
    allowed_pages?: string[];
}

interface BroadcasterEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, data: any) => void;
    broadcaster: Broadcaster | null;
}

// --- Page definitions (matches Sidebar nav) ---
const PAGE_OPTIONS = [
    { key: 'home',          label: 'Home',          description: 'Main ticket board',           icon: Home },
    { key: 'dashboard',     label: 'Dashboard',     description: 'Charts & analytics',          icon: LayoutDashboard },
    { key: 'reporters',     label: 'Reporters',     description: 'Reporter management',         icon: Users },
    { key: 'notifications', label: 'Notifications', description: 'System notifications',        icon: Bell },
];

// --- Sub-components ---
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

// --- Main Modal ---
const BroadcasterEditModal = ({ isOpen, onClose, onSave, broadcaster }: BroadcasterEditModalProps) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [allowedPages, setAllowedPages] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (broadcaster) {
            setCode(broadcaster.broadcaster_code || '');
            setName(broadcaster.broadcaster_name || '');
            setPassword('');
            setAllowedPages(broadcaster.allowed_pages || []);
        } else {
            setCode('');
            setName('');
            setPassword('');
            // Default: allow home & notifications for new broadcasters
            setAllowedPages(['home', 'notifications']);
        }
    }, [broadcaster, isOpen]);

    if (!isOpen) return null;

    const togglePage = (key: string) => {
        setAllowedPages(prev =>
            prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
        );
    };

    const toggleAll = () => {
        if (allowedPages.length === PAGE_OPTIONS.length) {
            setAllowedPages([]);
        } else {
            setAllowedPages(PAGE_OPTIONS.map(p => p.key));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(broadcaster?.id || 0, {
            broadcaster_code: code,
            broadcaster_name: name,
            password: password,
            allowed_pages: allowedPages,
        });
        setIsSaving(false);
    };

    const allSelected = allowedPages.length === PAGE_OPTIONS.length;

    return (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh]">

                {/* Header */}
                <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            {broadcaster ? 'Edit Broadcaster' : 'Add Broadcaster'}
                        </h2>
                        <p className="text-sm text-gray-400 font-medium">
                            Authentication & Page Access
                        </p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2.5 hover:bg-gray-100 text-gray-400 transition-all">
                        <X className="h-6 w-6" />
                    </button>
                </header>

                {/* Form Content */}
                <form id="broadcaster-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 bg-slate-50/20 space-y-6">

                    {/* --- Credentials Section --- */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                            <Shield className="h-5 w-5 text-indigo-600 shrink-0" />
                            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Credentials</span>
                        </div>

                        <InputField
                            label="Broadcaster Code"
                            value={code}
                            onChange={setCode}
                            required
                            placeholder="e.g. BC"
                        />

                        <InputField
                            label="Full Name"
                            value={name}
                            onChange={setName}
                            required
                            placeholder="e.g. Syam"
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

                    {/* --- RBAC Section --- */}
                    <div className="space-y-3">
                        {/* Section header */}
                        <div className="flex items-center justify-between p-3 bg-violet-50 rounded-xl border border-violet-100">
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-violet-600 shrink-0" />
                                <div>
                                    <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Page Access</span>
                                    <p className="text-[10px] text-violet-400 font-medium mt-0.5">Control which pages this broadcaster can view</p>
                                </div>
                            </div>
                            {/* Select all toggle */}
                            <button
                                type="button"
                                onClick={toggleAll}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-violet-600 hover:text-violet-800 uppercase tracking-wider transition-colors"
                            >
                                {allSelected
                                    ? <CheckSquare className="h-4 w-4" />
                                    : <Square className="h-4 w-4" />
                                }
                                {allSelected ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>

                        {/* Page checkboxes */}
                        <div className="grid grid-cols-1 gap-2">
                            {PAGE_OPTIONS.map(({ key, label, description, icon: Icon }) => {
                                const checked = allowedPages.includes(key);
                                return (
                                    <label
                                        key={key}
                                        className={`flex items-center gap-4 p-3.5 rounded-xl border-2 cursor-pointer transition-all select-none ${
                                            checked
                                                ? 'border-violet-300 bg-violet-50/80 shadow-sm shadow-violet-100'
                                                : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50'
                                        }`}
                                    >
                                        {/* Custom checkbox */}
                                        <div className={`relative h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                                            checked ? 'border-violet-500 bg-violet-500' : 'border-gray-300 bg-white'
                                        }`}>
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => togglePage(key)}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            />
                                            {checked && (
                                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Icon */}
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                            checked ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            <Icon className="h-4 w-4" />
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold transition-colors ${checked ? 'text-violet-800' : 'text-gray-700'}`}>{label}</p>
                                            <p className="text-[11px] text-gray-400 font-medium">{description}</p>
                                        </div>

                                        {/* Pill */}
                                        {checked && (
                                            <span className="text-[9px] font-black uppercase tracking-widest bg-violet-500 text-white px-2 py-0.5 rounded-full shrink-0">
                                                Allowed
                                            </span>
                                        )}
                                    </label>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <p className="text-[11px] text-gray-400 font-medium px-1">
                            {allowedPages.length === 0
                                ? '⚠️ No pages selected — broadcaster will see nothing.'
                                : `✓ ${allowedPages.length} of ${PAGE_OPTIONS.length} pages accessible.`
                            }
                        </p>
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
