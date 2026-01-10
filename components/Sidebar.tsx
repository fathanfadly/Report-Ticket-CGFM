import React from 'react';
import { Home, BarChart2, User, Zap, Bell, Settings } from 'lucide-react';
import Image from 'next/image';

const Sidebar = () => {
    return (
        <div className="flex h-screen w-20 flex-col items-center justify-between border-r border-gray-200 bg-white py-6">
            <div className="flex flex-col items-center gap-8">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-50 shadow-sm border border-gray-100">
                    <img src="/logo.jpg" alt="CGFM Logo" className="h-full w-full object-cover" />
                </div>

                <nav className="flex flex-col items-center gap-6">
                    <button className="text-gray-400 hover:text-purple-600 transition-colors">
                        <Home className="h-6 w-6" />
                    </button>
                    <button className="text-gray-400 hover:text-purple-600 transition-colors">
                        <BarChart2 className="h-6 w-6" />
                    </button>
                    <button className="text-gray-400 hover:text-purple-600 transition-colors">
                        <User className="h-6 w-6" />
                    </button>
                    <button className="text-gray-400 hover:text-purple-600 transition-colors">
                        <Zap className="h-6 w-6" />
                    </button>
                    <button className="text-gray-400 hover:text-purple-600 transition-colors relative">
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
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
