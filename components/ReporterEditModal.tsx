"use client";

import React, { useState, useEffect } from 'react';
import { X, User, Phone, Briefcase, MapPin } from 'lucide-react';

interface Reporter {
    id: number;
    nama: string;
    tipe_pelapor: string;
    nomor_telepon: string;
    pekerjaan: string;
    alamat: string;
}

interface ReporterEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, data: any) => void;
    reporter: Reporter | null;
}

const ReporterEditModal = ({ isOpen, onClose, onSave, reporter }: ReporterEditModalProps) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [phone, setPhone] = useState('');
    const [job, setJob] = useState('');
    const [address, setAddress] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (reporter) {
            setName(reporter.nama || '');
            setType(reporter.tipe_pelapor || '');
            setPhone(reporter.nomor_telepon || '');
            setJob(reporter.pekerjaan || '');
            setAddress(reporter.alamat || '');
        }
    }, [reporter, isOpen]);

    if (!isOpen || !reporter) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(reporter.id, {
            name,
            type,
            phone,
            job,
            address
        });
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Edit Reporter</h2>
                        <p className="text-sm text-gray-400">Update the information for this reporter.</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 text-gray-400 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <User className="h-3 w-3" /> Nama
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tipe Pelapor</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                >
                                    <option value="Personal">Personal</option>
                                    <option value="Instansi">Instansi</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Phone className="h-3 w-3" /> Telepon
                                </label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Briefcase className="h-3 w-3" /> Pekerjaan
                            </label>
                            <input
                                type="text"
                                value={job}
                                onChange={(e) => setJob(e.target.value)}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="h-3 w-3" /> Alamat
                            </label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-8 py-2.5 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReporterEditModal;
