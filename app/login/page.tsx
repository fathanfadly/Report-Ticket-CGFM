'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Radio, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Login failed. Please check your credentials.');
            } else {
                router.push('/home');
                router.refresh();
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-50 font-sans">
            
            {/* Left Section - Branding & Decor (Hidden on very small screens) */}
            <div className="hidden lg:flex lg:w-5/12 bg-indigo-900 relative flex-col justify-between p-12 overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] rounded-full bg-indigo-600/40 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[50%] rounded-full bg-blue-500/30 blur-[120px] pointer-events-none" />
                
                <div className="relative z-10">
                    <a href="/" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white transition-colors text-sm font-bold mb-12">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
                    </a>
                    
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 overflow-hidden rounded-xl shadow-lg border border-white/20 flex-shrink-0 bg-white">
                            <img src="/logo.jpg" alt="CGFM Logo" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">CGFM Portal</span>
                    </div>

                    <h1 className="text-4xl font-black text-white leading-tight mb-6">
                        Sistem Manajemen <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Layanan Internal</span>
                    </h1>
                    <p className="text-indigo-200 text-lg max-w-sm leading-relaxed">
                        Akses khusus bagi tim dan pegawai untuk mengelola laporan dan menindaklanjuti insiden secara real-time.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Koneksi Terenkripsi</h4>
                        <p className="text-xs text-indigo-200">Seluruh data Anda dilindungi oleh sistem keamanan standar industri.</p>
                    </div>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                {/* Mobile Back Button */}
                <a href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-bold">
                    <ArrowLeft className="w-4 h-4" /> Beranda
                </a>

                <div className="w-full max-w-md animate-in slide-in-from-bottom-4 fade-in duration-700">
                    <div className="text-center mb-10">
                        <div className="lg:hidden w-16 h-16 overflow-hidden rounded-xl flex items-center justify-center shadow-md border border-gray-100 mx-auto mb-6 bg-white">
                            <img src="/logo.jpg" alt="CGFM Logo" className="h-full w-full object-cover" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Selamat Datang</h2>
                        <p className="text-sm font-medium text-slate-500 mt-2">Silakan masuk menggunakan kredensial Anda.</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username / ID Pegawai</label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                    placeholder="Masukkan identitas Anda"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 hover:text-indigo-600 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> 
                                        Memproses...
                                    </>
                                ) : 'Masuk ke Portal'}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-xs font-medium text-slate-400 mt-8">
                        Lupa password atau tidak bisa login? <br className="sm:hidden" />
                        Hubungi <a href="#" className="text-indigo-600 hover:underline">Administrator IT CGFM</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
