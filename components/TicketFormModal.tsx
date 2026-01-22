import React, { useState, useEffect } from 'react';
import { X, User, FileText, Users } from 'lucide-react';

interface TicketFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (ticket: any) => void;
    initialData?: any;
}

const TicketFormModal = ({ isOpen, onClose, onSave, initialData }: TicketFormModalProps) => {
    // Section 1: Reporter Info
    const [reporterId, setReporterId] = useState<number | null>(null);
    const [tipePelapor, setTipePelapor] = useState('');
    const [namaPelapor, setNamaPelapor] = useState('');
    const [nomorTelepon, setNomorTelepon] = useState('');
    const [pekerjaan, setPekerjaan] = useState('');
    const [alamat, setAlamat] = useState('');

    // Selector states
    const [showSelector, setShowSelector] = useState(false);
    const [reporters, setReporters] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingReporters, setIsLoadingReporters] = useState(false);

    // Section 2: Report details
    const [kodeBroadcaster, setKodeBroadcaster] = useState('');
    const [judulLaporan, setJudulLaporan] = useState('');
    const [priority, setPriority] = useState('P2');
    const [status, setStatus] = useState('new');
    const [sumberLaporan, setSumberLaporan] = useState('');
    const [kategoriLaporan, setKategoriLaporan] = useState('');
    const [description, setDescription] = useState('');

    // UI/Image states
    const [imageUrl, setImageUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const resetState = () => {
        setReporterId(null);
        setTipePelapor('');
        setNamaPelapor('');
        setNomorTelepon('');
        setPekerjaan('');
        setAlamat('');
        setKodeBroadcaster('');
        setJudulLaporan('');
        setPriority('P2');
        setStatus('new');
        setSumberLaporan('');
        setKategoriLaporan('');
        setDescription('');
        setImageUrl('');
        setFile(null);
        setPreview(null);
    };

    useEffect(() => {
        if (initialData) {
            setReporterId(initialData.reporter_id || null);
            setTipePelapor(initialData.tipe_pelapor || '');
            setNamaPelapor(initialData.nama_pelapor || initialData.nama || '');
            setNomorTelepon(initialData.nomor_telepon || '');
            setPekerjaan(initialData.pekerjaan || '');
            setAlamat(initialData.alamat || '');
            setKodeBroadcaster(initialData.kode_broadcaster || '');
            setJudulLaporan(initialData.judul_laporan || initialData.title || '');
            setPriority(initialData.priority || 'P2');
            setStatus(initialData.status || 'new');
            setSumberLaporan(initialData.sumber_laporan || '');
            setKategoriLaporan(initialData.kategori_laporan || '');
            setDescription(initialData.description || '');
            setImageUrl(initialData.image_url || '');
            setPreview(initialData.image_url || null);
        } else {
            resetState();
        }
    }, [initialData, isOpen]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...initialData,
            reporter_id: reporterId,
            // Reporter Section
            tipe_pelapor: tipePelapor,
            nama_pelapor: namaPelapor,
            nama: namaPelapor, // Fallback for old code
            nomor_telepon: nomorTelepon,
            pekerjaan: pekerjaan,
            alamat: alamat,
            // Report Section
            kode_broadcaster: kodeBroadcaster,
            judul_laporan: judulLaporan,
            title: judulLaporan, // Match board display
            priority,
            status,
            sumber_laporan: sumberLaporan,
            kategori_laporan: kategoriLaporan,
            description,
            image_url: imageUrl || preview || null,
            file: file,
        });
        resetForm();
    };

    const resetForm = () => {
        resetState();
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImageUrl('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const fetchReporters = async (q = '') => {
        setIsLoadingReporters(true);
        try {
            const res = await fetch(`/api/reporters?q=${encodeURIComponent(q)}&limit=50`);
            const json = await res.json();
            const data = json.data || json; // Handle both paginated and non-paginated for safety
            setReporters(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch reporters:", error);
        } finally {
            setIsLoadingReporters(false);
        }
    };

    useEffect(() => {
        if (showSelector) {
            fetchReporters(searchQuery);
        }
    }, [showSelector, searchQuery]);

    const handleSelectReporter = (rep: any) => {
        setReporterId(rep.id);
        setTipePelapor(rep.tipe_pelapor || '');
        setNamaPelapor(rep.nama || '');
        setNomorTelepon(rep.nomor_telepon || '');
        setPekerjaan(rep.pekerjaan || '');
        setAlamat(rep.alamat || '');
        setShowSelector(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            {/* Reporter Selection Sub-Modal */}
            {showSelector && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Pilih Pelapor</h3>
                            <button onClick={() => setShowSelector(false)} className="rounded-full p-2 hover:bg-gray-100 text-gray-400">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Cari nama atau nomor telepon..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            />
                            <div className="absolute left-4 top-3.5 text-gray-400">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {isLoadingReporters ? (
                                <div className="py-12 text-center text-gray-400 text-sm">Memuat data pelapor...</div>
                            ) : reporters.length > 0 ? (
                                reporters.map((rep) => (
                                    <button
                                        key={rep.id}
                                        type="button"
                                        onClick={() => handleSelectReporter(rep)}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 text-left transition-all group"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{rep.nama}</span>
                                            <span className="text-xs text-gray-400">{rep.nomor_telepon || 'No Phone'} • {rep.tipe_pelapor}</span>
                                        </div>
                                        <div className="p-2 rounded-lg bg-gray-50 text-gray-300 group-hover:bg-white group-hover:text-indigo-400 transition-all">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-sm text-gray-500 mb-1">Tidak ada pelapor ditemukan</p>
                                    <p className="text-xs text-gray-400">Coba kata kunci lain atau ketik manual.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {initialData ? 'Edit Report Ticket' : 'Create New Report Ticket'}
                        </h2>
                        <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 text-gray-400 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500">
                        {initialData ? 'Update the report information including reporter details and report content.' : 'Fill in the information below to create a new report ticket.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: Detail Pelapor */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600">
                                    <User className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 tracking-tight">Detail Pelapor</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowSelector(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-all active:scale-[0.97]"
                            >
                                <Users className="h-4 w-4" />
                                Pilih Pelapor
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Tipe Pelapor</label>
                                <select
                                    required
                                    value={tipePelapor}
                                    onChange={(e) => setTipePelapor(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                >
                                    <option value="">Pilih Tipe</option>
                                    <option value="Masyarakat">Masyarakat</option>
                                    <option value="Polisi">Polisi</option>
                                    <option value="Instansi">Instansi</option>
                                    <option value="Internal">Internal</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Nama Pelapor</label>
                                <input
                                    type="text"
                                    required
                                    value={namaPelapor}
                                    onChange={(e) => setNamaPelapor(e.target.value)}
                                    placeholder="Ketik nama pelapor"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Nomor Telepon</label>
                                <input
                                    type="tel"
                                    value={nomorTelepon}
                                    onChange={(e) => setNomorTelepon(e.target.value)}
                                    placeholder="Ketik nomor hp pelapor"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Pekerjaan</label>
                                <select
                                    value={pekerjaan}
                                    onChange={(e) => setPekerjaan(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                >
                                    <option value="">Pilih Pekerjaan</option>
                                    <option value="Wiraswasta">Wiraswasta</option>
                                    <option value="Karyawan">Karyawan</option>
                                    <option value="PNS">PNS</option>
                                    <option value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Alamat</label>
                                <textarea
                                    value={alamat}
                                    onChange={(e) => setAlamat(e.target.value)}
                                    placeholder="Ketik alamat pelapor"
                                    rows={2}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Detail Laporan */}
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-pink-50 text-pink-600">
                                <FileText className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 tracking-tight">Detail Laporan</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Kode Broadcaster</label>
                                <select
                                    value={kodeBroadcaster}
                                    onChange={(e) => setKodeBroadcaster(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                >
                                    <option value="">Pilih Broadcaster</option>
                                    <option value="BC001">BC001 - Syam</option>
                                    <option value="BC002">BC002 - Dio</option>
                                    <option value="BC003">BC003 - Andre</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Judul Laporan</label>
                                <input
                                    type="text"
                                    required
                                    value={judulLaporan}
                                    onChange={(e) => setJudulLaporan(e.target.value)}
                                    placeholder="Ketik atau pilih judul laporan yang ada"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Kategori Laporan</label>
                                <select
                                    required
                                    value={kategoriLaporan}
                                    onChange={(e) => setKategoriLaporan(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                >
                                    <option value="">Pilih Kategori</option>
                                    <option value="Infrastruktur">Infrastruktur</option>
                                    <option value="Keamanan">Keamanan</option>
                                    <option value="Lingkungan">Lingkungan</option>
                                    <option value="Layanan Publik">Layanan Publik</option>
                                    <option value="Lain-lain">Lain-lain</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Sumber Laporan</label>
                                <select
                                    required
                                    value={sumberLaporan}
                                    onChange={(e) => setSumberLaporan(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                >
                                    <option value="">Pilih Sumber</option>
                                    <option value="WhatsApp">WhatsApp</option>
                                    <option value="Telepon">Telepon</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Langsung">Langsung</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                >
                                    <option value="P1">P1 - High</option>
                                    <option value="P2">P2 - Medium</option>
                                    <option value="P3">P3 - Low</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Initial Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                >
                                    <option value="urgent">Urgent</option>
                                    <option value="new">New/ Open</option>
                                    <option value="assessment">Assessment</option>
                                    <option value="backlog">Backlog</option>
                                    <option value="progress">In Progress</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Laporan / Deskripsi</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ketik isi laporan secara detail"
                                    rows={4}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Attachment (Image)</label>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => {
                                            setImageUrl(e.target.value);
                                            setFile(null);
                                            setPreview(null);
                                        }}
                                        placeholder="Paste image URL here..."
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                                    />
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-1 rounded-xl border-2 border-dashed border-gray-200 p-4 text-xs font-bold text-gray-400 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                                        >
                                            {file ? `File: ${file.name}` : 'Klik untuk Upload Gambar'}
                                        </button>
                                        {(imageUrl || preview) && (
                                            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 shadow-sm">
                                                <img src={imageUrl || preview!} alt="Preview" className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => { setImageUrl(''); setFile(null); setPreview(null); }}
                                                    className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="h-2 w-2" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 rounded-lg bg-[#6366f1] text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {initialData ? 'Save Changes' : 'Create Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketFormModal;
