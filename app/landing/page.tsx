'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Activity, Users, Radio, LayoutDashboard } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
            {/* Navbar */}
            <nav className="w-full bg-white shadow-sm px-8 py-4 flex items-center justify-between border-b border-gray-100 z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-xl shadow-md border border-gray-100 flex-shrink-0">
                        <img src="/logo.jpg" alt="CGFM Logo" className="h-full w-full object-cover" />
                    </div>
                    <span className="text-xl font-black text-gray-900 tracking-tight">CGFM</span>
                </div>
                <div>
                    <Link href="/login" className="px-6 py-2.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 font-bold transition-all flex items-center gap-2">
                        Masuk / Login <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-widest mb-8">
                    Sistem Internal Khusus Pegawai CGFM
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6 max-w-4xl leading-tight">
                    Portal <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Manajemen Layanan</span> CGFM
                </h1>

                <p className="text-lg md:text-xl text-gray-500 max-w-3xl mb-12 leading-relaxed">
                    Selamat datang di halaman utama Portal CGFM. Platform ini digunakan secara khusus oleh tim internal untuk memantau, mendistribusikan, dan menyelesaikan laporan serta operasional di lapangan.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link
                        href="/login"
                        className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1"
                    >
                        Login ke Dashboard Utama
                        <LayoutDashboard className="w-5 h-5" />
                    </Link>
                </div>

                {/* Feature highlights */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full text-left">
                    <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 border border-blue-100">
                            <Activity className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-3">Monitoring Real-time</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Pantau tiket masuk dan laporan warga secara langsung. Pastikan semua kendala tertangani dengan respons cepat dan terukur.</p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6 border border-purple-100">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-3">Alokasi Tim</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Manajemen penugasan tim broadcaster dan pelapor di lapangan untuk penanganan insiden yang lebih efisien.</p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 border border-emerald-100">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-3">Keamanan Ekosistem</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Dilengkapi dengan enkripsi dan role-based access control untuk menjamin kerahasiaan data internal dan publik.</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-8 text-center text-sm font-semibold text-gray-400 bg-white border-t border-gray-100">
                <p>&copy; {new Date().getFullYear()} Hak Cipta Portal Internal CGFM.</p>
            </footer>
        </div>
    );
}
