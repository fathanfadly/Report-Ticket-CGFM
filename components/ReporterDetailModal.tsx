"use client";

import React from 'react';
import { X, User, Phone, MapPin, Briefcase, GraduationCap, Calendar, Heart, Music, Car, Smartphone, Radio, Tv, Map } from 'lucide-react';

interface ReporterDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (reporter: any) => void;
    reporter: any | null;
}

const ReporterDetailModal = ({ isOpen, onClose, onEdit, reporter }: ReporterDetailModalProps) => {
    if (!isOpen || !reporter) return null;

    const DetailItem = ({ icon: Icon, label, value, colorClass = "text-gray-400" }: { icon: any, label: string, value: string | number | null, colorClass?: string }) => (
        <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-gray-50/50 border border-gray-100/50 transition-all hover:bg-white hover:shadow-sm hover:border-indigo-100">
            <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</span>
            </div>
            <span className="text-sm font-bold text-gray-800 leading-tight">
                {value || '-'}
            </span>
        </div>
    );

    const SectionHeader = ({ icon: Icon, title, bgColor }: { icon: any, title: string, bgColor: string }) => (
        <div className="flex items-center gap-3 mb-4 mt-2">
            <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${bgColor} shadow-sm border border-white/20`}>
                <Icon className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">{title}</h3>
        </div>
    );

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 border border-white/20">
                            {reporter.nama?.charAt(0) || 'R'}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tighter">{reporter.nama}</h2>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wide">
                                <span>ID #{reporter.id}</span>
                                <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                                <span className="text-indigo-600">{reporter.tipe_pelapor || 'Reporter'}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2.5 hover:bg-gray-100 text-gray-400 transition-all active:scale-95">
                        <X className="h-6 w-6" />
                    </button>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

                        {/* Section: Personal Info */}
                        <div className="space-y-4">
                            <SectionHeader icon={User} title="Informasi Personal" bgColor="bg-indigo-500" />
                            <div className="grid grid-cols-1 gap-3">
                                <DetailItem icon={Phone} label="No HP" value={reporter.no_hp} colorClass="text-indigo-400" />
                                <DetailItem icon={MapPin} label="Alamat" value={reporter.alamat} colorClass="text-red-400" />
                                <div className="grid grid-cols-2 gap-3">
                                    <DetailItem icon={Calendar} label="Usia" value={reporter.usia ? `${reporter.usia} Tahun` : null} colorClass="text-orange-400" />
                                    <DetailItem icon={User} label="Jenis Kelamin" value={reporter.jenis_kelamin} colorClass="text-blue-400" />
                                </div>
                                <DetailItem icon={GraduationCap} label="Pendidikan" value={reporter.pendidikan} colorClass="text-purple-400" />
                            </div>
                        </div>

                        {/* Section: Professional Info */}
                        <div className="space-y-4">
                            <SectionHeader icon={Briefcase} title="Informasi Profesional" bgColor="bg-emerald-500" />
                            <div className="grid grid-cols-1 gap-3">
                                <DetailItem icon={Briefcase} label="Pekerjaan" value={reporter.pekerjaan} colorClass="text-emerald-400" />
                                <DetailItem icon={User} label="Jabatan" value={reporter.jabatan} colorClass="text-teal-400" />
                            </div>
                        </div>

                        {/* Section: Lifestyle & Interests */}
                        <div className="space-y-4">
                            <SectionHeader icon={Heart} title="Gaya Hidup & Minat" bgColor="bg-pink-500" />
                            <div className="grid grid-cols-1 gap-3">
                                <DetailItem icon={Heart} label="Hobi" value={reporter.hobi} colorClass="text-pink-400" />
                                <DetailItem icon={Music} label="Pilihan Jenis Lagu" value={reporter.pilihan_jenis_lagu} colorClass="text-violet-400" />
                                <div className="grid grid-cols-2 gap-3">
                                    <DetailItem icon={Car} label="Alat Transportasi" value={reporter.alat_transportasi} colorClass="text-slate-400" />
                                    <DetailItem icon={Smartphone} label="Range Harga Gadget" value={reporter.range_harga_gadget} colorClass="text-indigo-400" />
                                </div>
                            </div>
                        </div>

                        {/* Section: Media Habits */}
                        <div className="space-y-4">
                            <SectionHeader icon={Radio} title="Kebiasaan Media" bgColor="bg-amber-500" />
                            <div className="grid grid-cols-1 gap-3">
                                <DetailItem icon={Radio} label="Radio Sering Diputar" value={reporter.radio_sering_diputar} colorClass="text-amber-400" />
                                <DetailItem icon={Radio} label="Acara Radio Favorit" value={reporter.acara_radio_favorit} colorClass="text-orange-400" />
                                <DetailItem icon={Tv} label="TV Sering Ditonton" value={reporter.tv_sering_ditonton} colorClass="text-rose-400" />
                                <DetailItem icon={Tv} label="Acara TV Favorit" value={reporter.acara_tv_favorit} colorClass="text-red-400" />
                            </div>
                        </div>

                        {/* Section: Favorites */}
                        <div className="space-y-4 md:col-span-2">
                            <SectionHeader icon={Map} title="Favorit" bgColor="bg-blue-500" />
                            <DetailItem icon={MapPin} label="Objek Wisata Favorit" value={reporter.objek_wisata_favorit} colorClass="text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="flex h-20 items-center justify-end gap-3 border-t border-gray-100 bg-white px-8 shrink-0">
                    <button
                        onClick={() => {
                            onClose();
                            onEdit(reporter);
                        }}
                        className="px-8 py-2.5 rounded-xl border-2 border-indigo-600 text-sm font-black text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95"
                    >
                        EDIT DATA
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 rounded-xl bg-gray-900 text-sm font-black text-white shadow-lg shadow-gray-100 hover:bg-black transition-all active:scale-95"
                    >
                        TUTUP
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ReporterDetailModal;
