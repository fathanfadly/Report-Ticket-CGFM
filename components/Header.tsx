'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import CalendarPopup from './CalendarPopup';
import { format } from 'date-fns';

interface HeaderProps {
    isCalendarOpen: boolean;
    toggleCalendar: () => void;
    selectedDate: Date | null;
    onSelectDate: (date: Date | null) => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    onAddTicketClick: () => void;
}

const Header = ({ isCalendarOpen, toggleCalendar, selectedDate, onSelectDate, searchQuery, setSearchQuery, onAddTicketClick }: HeaderProps) => {
    const [username, setUsername] = useState<string>('User');
    const [initials, setInitials] = useState<string>('U');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.username) {
                        setUsername(data.username);
                        setInitials(data.username.charAt(0).toUpperCase());
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user");
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="flex flex-col gap-6 bg-white px-8 py-6 pb-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gray-50 shadow-sm border border-gray-100">
                        <img src="/logo.jpg" alt="CGFM Logo" className="h-full w-full object-cover" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">CityGuideFM Report Tracker</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search Tickets..."
                            className="h-10 w-64 rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    <button
                        onClick={onAddTicketClick}
                        className="flex h-10 items-center gap-2 rounded-full bg-[#4f46e5] px-6 text-sm font-medium text-white shadow-md shadow-purple-200 hover:bg-[#4338ca] transition-colors ml-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Ticket
                    </button>

                    <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                        <span className="text-sm font-medium text-gray-600 pl-1">Welcome, <span className="font-bold text-indigo-600">{username}</span>!</span>
                        <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow-sm">
                            <div className="h-full w-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center border-b border-gray-100 relative">
                <button
                    className="flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-800"
                    onClick={() => onSelectDate(null)}
                >
                    <div className="h-4 w-4">☰</div>
                    List
                </button>
                <div className="relative">
                    <button
                        onClick={toggleCalendar}
                        className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${selectedDate || isCalendarOpen ? 'border-[#4f46e5] text-[#4f46e5]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        <div className="h-4 w-4">📅</div>
                        {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Calendar"}
                    </button>

                    {isCalendarOpen && (
                        <CalendarPopup
                            currentDate={selectedDate || new Date()}
                            selectedDate={selectedDate}
                            onSelectDate={(date) => {
                                onSelectDate(date);
                                toggleCalendar();
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
