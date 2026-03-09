"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import BroadcasterEditModal from '@/components/BroadcasterEditModal';
import { Search, ChevronLeft, ChevronRight, Radio, Shield, Edit2, Trash2, Download, Plus, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';

export default function BroadcastersPage() {
    const [broadcasters, setBroadcasters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const [selectedBroadcaster, setSelectedBroadcaster] = useState<any | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchBroadcasters = async (page = 1, query = '') => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/broadcasters?q=${encodeURIComponent(query)}&page=${page}&limit=${pagination.limit}`);
            const data = await res.json();
            if (data.data) {
                setBroadcasters(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Failed to fetch broadcasters:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBroadcasters(1, searchQuery);
    }, [searchQuery]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchBroadcasters(newPage, searchQuery);
        }
    };

    const handleExportExcel = async () => {
        setIsExporting(true);
        try {
            const res = await fetch(`/api/broadcasters?all=true&q=${encodeURIComponent(searchQuery)}`);
            const json = await res.json();
            const allBroadcasters = json.data || [];

            if (allBroadcasters.length === 0) {
                alert("No data to export");
                return;
            }

            const excelData = allBroadcasters.map((rep: any) => ({
                'ID': rep.id,
                'Code': rep.broadcaster_code,
                'Name': rep.broadcaster_name,
                'Created At': rep.created_at,
                'Updated At': rep.updated_at
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Broadcasters');

            const wscols = [
                { wch: 10 }, { wch: 15 }, { wch: 30 }, { wch: 25 }, { wch: 25 }
            ];
            worksheet['!cols'] = wscols;

            const date = new Date().toISOString().split('T')[0];
            const filename = `Broadcasters_List_${date}.xlsx`;
            XLSX.writeFile(workbook, filename);
        } catch (error) {
            console.error("Export error:", error);
            alert("Failed to export Excel file.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this broadcaster?")) return;

        try {
            const res = await fetch(`/api/broadcasters?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchBroadcasters(pagination.page, searchQuery);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete broadcaster");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleSave = async (id: number, updatedData: any) => {
        try {
            const method = id === 0 ? 'POST' : 'PATCH';
            const url = id === 0 ? '/api/broadcasters' : `/api/broadcasters?id=${id}`;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                setIsEditModalOpen(false);
                fetchBroadcasters(1, searchQuery);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save broadcaster");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    return (
        <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">
            <Sidebar />
            <BroadcasterEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
                broadcaster={selectedBroadcaster}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 shadow-sm border border-orange-100 transition-transform active:scale-95">
                            <Radio className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Broadcasters</h1>
                            <p className="text-xs text-gray-400 font-medium whitespace-nowrap">Manage broadcaster login accounts and codes</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setSelectedBroadcaster(null);
                                setIsEditModalOpen(true);
                            }}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                        >
                            <Plus className="h-4 w-4" />
                            New Broadcaster
                        </button>
                        <button
                            onClick={handleExportExcel}
                            disabled={isExporting}
                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                        >
                            <Download className="h-4 w-4 text-indigo-600" />
                            {isExporting ? 'Exporting...' : 'Export'}
                        </button>
                        <div className="relative w-64">
                            <input
                                type="text"
                                placeholder="Search code/name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 pl-11 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            />
                            <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
                    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-100">
                                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Code</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Broadcaster Name</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Added</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse shadow-sm">
                                            <td colSpan={5} className="px-8 py-8"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                                        </tr>
                                    ))
                                ) : broadcasters.length > 0 ? (
                                    broadcasters.map((rep) => (
                                        <tr key={rep.id} className="hover:bg-indigo-50/10 transition-colors group">
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">#{rep.id}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="inline-flex items-center justify-center h-8 w-12 rounded-lg bg-indigo-600 text-white text-xs font-black shadow-sm ring-4 ring-indigo-50">
                                                    {rep.broadcaster_code}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-200">
                                                        {rep.broadcaster_name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-800 tracking-tight">{rep.broadcaster_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {format(parseISO(rep.created_at), 'MMMM d, yyyy')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBroadcaster(rep);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-indigo-100"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(rep.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <p className="text-sm text-gray-400 font-medium whitespace-nowrap">No broadcasters registered yet.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-8 py-6 bg-slate-50 border-t border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                showing <span className="text-gray-900">{broadcasters.length}</span> of <span className="text-gray-900">{pagination.total}</span> entries
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <div className="flex items-center gap-1 mx-2">
                                    {Array.from({ length: pagination.totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={clsx(
                                                "h-8 w-8 rounded-xl text-xs font-black transition-all",
                                                pagination.page === i + 1
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                                    : "text-gray-400 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-100"
                                            )}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
