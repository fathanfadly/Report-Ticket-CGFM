"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ReporterEditModal from '@/components/ReporterEditModal';
import ReporterDetailModal from '@/components/ReporterDetailModal';
import { Search, ChevronLeft, ChevronRight, User, Phone, Briefcase, MapPin, Edit2, Trash2, Download, Eye } from 'lucide-react';
import { clsx } from 'clsx';
import * as XLSX from 'xlsx';

export default function ReportersPage() {
    const [reporters, setReporters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const [selectedReporter, setSelectedReporter] = useState<any | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchReporters = async (page = 1, query = '') => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/reporters?q=${encodeURIComponent(query)}&page=${page}&limit=${pagination.limit}`);
            const data = await res.json();
            if (data.data) {
                setReporters(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Failed to fetch reporters:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReporters(1, searchQuery);
    }, [searchQuery]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchReporters(newPage, searchQuery);
        }
    };

    const handleExportExcel = async () => {
        setIsExporting(true);
        try {
            // Fetch ALL reporters with currently applied search query
            const res = await fetch(`/api/reporters?all=true&q=${encodeURIComponent(searchQuery)}`);
            const json = await res.json();
            const allReporters = json.data || [];

            if (allReporters.length === 0) {
                alert("No data to export");
                return;
            }

            // Map data to Excel format
            const excelData = allReporters.map((rep: any) => ({
                'id': rep.id,
                'nama': rep.nama,
                'tipe_pelapor': rep.tipe_pelapor,
                'no_hp': rep.no_hp,
                'alamat': rep.alamat,
                'pekerjaan': rep.pekerjaan,
                'jabatan': rep.jabatan,
                'pendidikan': rep.pendidikan,
                'usia': rep.usia,
                'jenis_kelamin': rep.jenis_kelamin,
                'hobi': rep.hobi,
                'pilihan_jenis_lagu': rep.pilihan_jenis_lagu,
                'alat_transportasi': rep.alat_transportasi,
                'range_harga_gadget': rep.range_harga_gadget,
                'radio_sering_diputar': rep.radio_sering_diputar,
                'acara_radio_favorit': rep.acara_radio_favorit,
                'objek_wisata_favorit': rep.objek_wisata_favorit,
                'tv_sering_ditonton': rep.tv_sering_ditonton,
                'acara_tv_favorit': rep.acara_tv_favorit
            }));

            // Create workbook and worksheet
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporters');

            // Set column widths
            const wscols = [
                { wch: 5 },  // ID
                { wch: 25 }, // Name
                { wch: 15 }, // Type
                { wch: 20 }, // Phone
                { wch: 40 }, // Address
                { wch: 20 }, // Job
                { wch: 20 }, // Position
                { wch: 20 }, // Education
                { wch: 10 }, // Age
                { wch: 15 }, // Gender
                { wch: 30 }, // Hobby
                { wch: 25 }, // Song Type
                { wch: 20 }, // Transportation
                { wch: 20 }, // Gadget
                { wch: 30 }, // Freq Radio
                { wch: 30 }, // Fav Radio
                { wch: 30 }, // Fav Tourist
                { wch: 30 }, // Freq TV
                { wch: 30 }, // Fav TV
            ];
            worksheet['!cols'] = wscols;

            // Generate filename with date
            const date = new Date().toISOString().split('T')[0];
            const filename = `Reporters_Export_${date}.xlsx`;

            // Download file
            XLSX.writeFile(workbook, filename);
        } catch (error) {
            console.error("Export error:", error);
            alert("Failed to export Excel file.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this reporter?")) return;

        try {
            const res = await fetch(`/api/reporters?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok) {
                fetchReporters(pagination.page, searchQuery);
            } else {
                alert(data.error || "Failed to delete reporter");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting.");
        }
    };

    const handleEditSave = async (id: number, updatedData: any) => {
        try {
            const res = await fetch(`/api/reporters?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                setIsEditModalOpen(false);
                fetchReporters(pagination.page, searchQuery);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to update reporter");
            }
        } catch (error) {
            console.error("Edit error:", error);
            alert("An error occurred while saving.");
        }
    };

    return (
        <>
            <ReporterEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleEditSave}
                reporter={selectedReporter}
            />
            <ReporterDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                onEdit={(rep) => {
                    setSelectedReporter(rep);
                    setIsEditModalOpen(true);
                }}
                reporter={selectedReporter}
            />
                {/* Header */}
                <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100 transition-transform active:scale-95">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Reporter Management</h1>
                            <p className="text-xs text-gray-400 font-medium whitespace-nowrap">Manage and view all reporter information</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportExcel}
                            disabled={isExporting}
                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                        >
                            <Download className="h-4 w-4 text-indigo-600" />
                            {isExporting ? 'Exporting...' : 'Export Excel'}
                        </button>
                        <div className="relative w-96">
                            <input
                                type="text"
                                placeholder="Search by name or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 pl-11 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            />
                            <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50/30">
                    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reporter</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job & Address</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse shadow-sm">
                                            <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                                        </tr>
                                    ))
                                ) : reporters.length > 0 ? (
                                    reporters.map((rep) => (
                                        <tr key={rep.id} className="hover:bg-indigo-50/10 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 group-hover:scale-110 transition-transform">
                                                        {rep.nama.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-800">{rep.nama}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 text-slate-500 rounded-md border border-slate-200 uppercase">
                                                    {rep.tipe_pelapor || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold uppercase tracking-tight">
                                                        <Phone className="h-3 w-3" />
                                                        {rep.no_hp || 'No Phone'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 max-w-xs transition-opacity">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                                        <Briefcase className="h-3 w-3 text-gray-400" />
                                                        {rep.pekerjaan || 'No Job'}
                                                    </div>
                                                    <div className="flex items-start gap-1.5 text-[11px] text-gray-400 line-clamp-1">
                                                        <MapPin className="h-3 w-3 text-gray-300 mt-0.5" />
                                                        {rep.alamat || 'No Address'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedReporter(rep);
                                                            setIsDetailModalOpen(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="See Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(rep.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Reporter"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <p className="text-sm text-gray-400 font-medium">No reporters found match your search.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-8 py-6 bg-slate-50/50 border-t border-gray-50">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                showing <span className="text-gray-900">{reporters.length}</span> of <span className="text-gray-900">{pagination.total}</span> reporters
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <div className="flex items-center gap-1 mx-2">
                                    {Array.from({ length: pagination.totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={clsx(
                                                "h-8 w-8 rounded-lg text-xs font-bold transition-all",
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
                                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
        </>
    );
}
