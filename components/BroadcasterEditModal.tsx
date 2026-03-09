"use client";

import React, { useState, useEffect } from 'react';
import { X, User, Phone, Briefcase, MapPin, Radio } from 'lucide-react';

interface Broadcaster {
    id: number;
    nama: string;
    tipe_pelapor: string;
    no_hp: string;
    pekerjaan: string;
    alamat: string;
    jabatan?: string;
    pendidikan?: string;
    usia?: number;
    jenis_kelamin?: string;
    hobi?: string;
    pilihan_jenis_lagu?: string;
    alat_transportasi?: string;
    range_harga_gadget?: string;
    radio_sering_diputar?: string;
    acara_radio_favorit?: string;
    objek_wisata_favorit?: string;
    tv_sering_ditonton?: string;
    acara_tv_favorit?: string;
}

interface BroadcasterEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, data: any) => void;
    broadcaster: Broadcaster | null;
}

const InputField = ({ label, value, onChange, type = "text", placeholder = "", required = false }: any) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 border border-gray-100 uppercase tracking-widest leading-none block">{label}</label>
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
    // Basic Info
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [phone, setPhone] = useState('');
    const [job, setJob] = useState('');
    const [address, setAddress] = useState('');

    // Demographic & Lifestyle Info
    const [jabatan, setJabatan] = useState('');
    const [pendidikan, setPendidikan] = useState('');
    const [usia, setUsia] = useState<string | number>('');
    const [jenisKelamin, setJenisKelamin] = useState('');
    const [hobi, setHobi] = useState('');
    const [jenisLagu, setJenisLagu] = useState('');
    const [transportasi, setTransportasi] = useState('');
    const [hargaGadget, setHargaGadget] = useState('');
    const [radioSering, setRadioSering] = useState('');
    const [radioFavorit, setRadioFavorit] = useState('');
    const [wisataFavorit, setWisataFavorit] = useState('');
    const [tvSering, setTvSering] = useState('');
    const [tvFavorit, setTvFavorit] = useState('');

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (broadcaster) {
            setName(broadcaster.nama || '');
            setType(broadcaster.tipe_pelapor || 'Broadcaster');
            setPhone(broadcaster.no_hp || '');
            setJob(broadcaster.pekerjaan || '');
            setAddress(broadcaster.alamat || '');

            setJabatan(broadcaster.jabatan || '');
            setPendidikan(broadcaster.pendidikan || '');
            setUsia(broadcaster.usia || '');
            setJenisKelamin(broadcaster.jenis_kelamin || '');
            setHobi(broadcaster.hobi || '');
            setJenisLagu(broadcaster.pilihan_jenis_lagu || '');
            setTransportasi(broadcaster.alat_transportasi || '');
            setHargaGadget(broadcaster.range_harga_gadget || '');
            setRadioSering(broadcaster.radio_sering_diputar || '');
            setRadioFavorit(broadcaster.acara_radio_favorit || '');
            setWisataFavorit(broadcaster.objek_wisata_favorit || '');
            setTvSering(broadcaster.tv_sering_ditonton || '');
            setTvFavorit(broadcaster.acara_tv_favorit || '');
        } else {
            // Reset for "Add Mode"
            setName('');
            setType('Broadcaster');
            setPhone('');
            setJob('');
            setAddress('');
            setJabatan('');
            setPendidikan('');
            setUsia('');
            setJenisKelamin('');
            setHobi('');
            setJenisLagu('');
            setTransportasi('');
            setHargaGadget('');
            setRadioSering('');
            setRadioFavorit('');
            setWisataFavorit('');
            setTvSering('');
            setTvFavorit('');
        }
    }, [broadcaster, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(broadcaster?.id || 0, {
            nama: name,
            tipe_pelapor: type,
            no_hp: phone,
            pekerjaan: job,
            alamat: address,
            jabatan,
            pendidikan,
            usia: usia === '' ? null : Number(usia),
            jenis_kelamin: jenisKelamin,
            hobi,
            pilihan_jenis_lagu: jenisLagu,
            alat_transportasi: transportasi,
            range_harga_gadget: hargaGadget,
            radio_sering_diputar: radioSering,
            acara_radio_favorit: radioFavorit,
            objek_wisata_favorit: wisataFavorit,
            tv_sering_ditonton: tvSering,
            acara_tv_favorit: tvFavorit
        });
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            {broadcaster ? 'Edit Broadcaster Information' : 'Add New Broadcaster'}
                        </h2>
                        <p className="text-sm text-gray-400">Update complete profile and lifestyle data.</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2.5 hover:bg-gray-100 text-gray-400 transition-all">
                        <X className="h-6 w-6" />
                    </button>
                </header>

                {/* Form Content */}
                <form id="broadcaster-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

                        {/* Section: Basic & Personal */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <User className="h-4 w-4" /> Personal & Basic
                            </h3>
                            <div className="space-y-4">
                                <InputField label="Nama Lengkap" value={name} onChange={setName} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 border border-gray-100 uppercase tracking-widest leading-none block">Tipe</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                        >
                                            <option value="Broadcaster">Broadcaster</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Team">Team</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <InputField label="No HP" value={phone} onChange={setPhone} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Usia" type="number" value={usia} onChange={setUsia} placeholder="e.g. 25" />
                                    <InputField label="Jenis Kelamin" value={jenisKelamin} onChange={setJenisKelamin} placeholder="e.g. M / F" />
                                </div>
                                <InputField label="Pendidikan Terakhir" value={pendidikan} onChange={setPendidikan} placeholder="e.g. S1, SMA" />
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 border border-gray-100 uppercase tracking-widest leading-none block">Alamat</label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        rows={3}
                                        className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium resize-none shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Professional & Lifestyle */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Briefcase className="h-4 w-4" /> Professional & Lifestyle
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Pekerjaan" value={job} onChange={setJob} />
                                    <InputField label="Jabatan" value={jabatan} onChange={setJabatan} />
                                </div>
                                <InputField label="Hobi" value={hobi} onChange={setHobi} placeholder="e.g. Membaca, Olahraga" />
                                <InputField label="Pilihan Jenis Lagu" value={jenisLagu} onChange={setJenisLagu} placeholder="e.g. POP, Rock" />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Transportasi" value={transportasi} onChange={setTransportasi} placeholder="e.g. Mobil" />
                                    <InputField label="Range Harga Gadget" value={hargaGadget} onChange={setHargaGadget} placeholder="e.g. 1-2 Juta" />
                                </div>
                                <InputField label="Objek Wisata Favorit" value={wisataFavorit} onChange={setWisataFavorit} />
                            </div>
                        </div>

                        {/* Section: Media Habits */}
                        <div className="space-y-6 md:col-span-2 pt-4 border-t border-gray-50">
                            <h3 className="text-xs font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Radio className="h-4 w-4" /> Media Habit Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Radio Sering Diputar" value={radioSering} onChange={setRadioSering} />
                                <InputField label="Acara Radio Favorit" value={radioFavorit} onChange={setRadioFavorit} />
                                <InputField label="TV Sering Ditonton" value={tvSering} onChange={setTvSering} />
                                <InputField label="Acara TV Favorit" value={tvFavorit} onChange={setTvFavorit} />
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
                        {isSaving ? 'SAVING DATA...' : broadcaster ? 'SAVE ALL CHANGES' : 'ADD BROADCASTER'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default BroadcasterEditModal;
