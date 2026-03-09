import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Home, BarChart2, User, Radio, Bell, Settings } from 'lucide-react';

const Sidebar = () => {
    const pathname = usePathname();

    return (
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
                    >
                        <Home className="h-6 w-6" />
                    </Link>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
                        <BarChart2 className="h-6 w-6" />
                    </button>
                    <Link
                        href="/reporters"
                        className={clsx(
                            "p-2 rounded-xl transition-all",
                            pathname === '/reporters' ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-gray-400 hover:text-indigo-600 hover:bg-slate-50"
                        )}
                    >
                        <User className="h-6 w-6" />
                    </Link>
                    <Link
                        href="/broadcasters"
                        className={clsx(
                            "p-2 rounded-xl transition-all",
                            pathname === '/broadcasters' ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-gray-400 hover:text-indigo-600 hover:bg-slate-50"
                        )}
                    >
                        <Radio className="h-6 w-6" />
                    </Link>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all relative">
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>
                </nav>
            </div>

            <div className="flex flex-col items-center gap-6">
                <button className="text-gray-400 hover:text-purple-600 transition-colors">
                    <Settings className="h-6 w-6" />
                </button>
                <div className="h-10 w-10 rounded-full bg-orange-400 overflow-hidden border-2 border-white shadow-md">
                    {/* Creating a simple avatar placeholder since we don't have a real image yet */}
                    <div className="flex w-full h-full items-center justify-center text-white font-bold">U</div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
