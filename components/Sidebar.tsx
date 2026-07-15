'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { Home, BarChart2, User, Radio, Bell, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string>('U');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { unreadCount } = useNotifications();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setRole(data.role);
                    if (data.username) {
                        setUsername(data.username.charAt(0).toUpperCase());
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user");
            }
        };
        fetchUser();
    }, []);

    const handleLogoutConfirm = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    return (
        <>
            <div className="flex h-screen w-20 flex-col items-center justify-between border-r border-gray-200 bg-white py-6">
                <div className="flex flex-col items-center gap-8">
                    <Link href="/" className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-50 shadow-sm border border-gray-100 transition-transform active:scale-95">
                        <img src="/logo.jpg" alt="CGFM Logo" className="h-full w-full object-cover" />
                    </Link>

                    <nav className="flex flex-col items-center gap-6">
                        <Link
                            href="/"
                            className={clsx(
                                "p-2 rounded-xl transition-all",
                                pathname === '/' ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-gray-400 hover:text-indigo-600 hover:bg-slate-50"
                            )}
                            title="Home"
                        >
                            <Home className="h-6 w-6" />
                        </Link>
                        <Link
                            href="/dashboard"
                            className={clsx(
                                "p-2 rounded-xl transition-all",
                                pathname === '/dashboard' ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-gray-400 hover:text-indigo-600 hover:bg-slate-50"
                            )}
                            title="Dashboard"
                        >
                            <BarChart2 className="h-6 w-6" />
                        </Link>
                        <Link
                            href="/reporters"
                            className={clsx(
                                "p-2 rounded-xl transition-all",
                                pathname === '/reporters' ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-gray-400 hover:text-indigo-600 hover:bg-slate-50"
                            )}
                            title="Reporters"
                        >
                            <User className="h-6 w-6" />
                        </Link>

                        {role === 'superadmin' && (
                            <Link
                                href="/broadcasters"
                                className={clsx(
                                    "p-2 rounded-xl transition-all",
                                    pathname === '/broadcasters' ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-gray-400 hover:text-indigo-600 hover:bg-slate-50"
                                )}
                                title="Broadcasters"
                            >
                                <Radio className="h-6 w-6" />
                            </Link>
                        )}

                        <Link
                            href="/notifications"
                            className={clsx(
                                "p-2 rounded-xl transition-all relative",
                                pathname === '/notifications' ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-gray-400 hover:text-indigo-600 hover:bg-slate-50"
                            )}
                            title="Notifications"
                        >
                            <Bell className="h-6 w-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                            )}
                        </Link>
                    </nav>
                </div>


                <div className="flex flex-col items-center gap-6">
                    <button onClick={() => setShowLogoutModal(true)} title="Logout" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <LogOut className="h-6 w-6" />
                    </button>
                    <div className="h-10 w-10 rounded-full bg-orange-400 overflow-hidden border-2 border-white shadow-md">
                        <div className="flex w-full h-full items-center justify-center text-white font-bold">{username}</div>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-in fade-in zoom-in-95">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Out</h3>
                        <p className="text-sm text-gray-500 mb-6">Are you sure you want to log out?</p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogoutConfirm}
                                className="px-5 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
