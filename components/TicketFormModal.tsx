import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TicketFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (ticket: any) => void;
    initialData?: any;
}

const TicketFormModal = ({ isOpen, onClose, onSave, initialData }: TicketFormModalProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('P2');
    const [status, setStatus] = useState('new');
    const [imageUrl, setImageUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const resetState = () => {
        setTitle('');
        setDescription('');
        setPriority('P2');
        setStatus('new');
        setImageUrl('');
        setFile(null);
        setPreview(null);
    };

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setPriority(initialData.priority || 'P2');
            setStatus(initialData.status || 'new');
            setImageUrl(initialData.image_url || '');
            setPreview(initialData.image_url || null);
        } else {
            resetState();
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...initialData,
            title,
            description,
            priority,
            status,
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[450px] rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Update Ticket' : 'Add New Ticket'}
                    </h2>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Ticket Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Fix login bug..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide more background info..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                            >
                                <option value="P1">P1 - High</option>
                                <option value="P2">P2 - Medium</option>
                                <option value="P3">P3 - Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                            >
                                <option value="urgent">Urgent</option>
                                <option value="new">New/ Open</option>
                                <option value="assessment">Assessment</option>
                                <option value="backlog">Backlog</option>
                                <option value="progress">In Progress</option>
                                <option value="pending">Pending</option>
                                <option value="blocked">Blocked</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => {
                                    setImageUrl(e.target.value);
                                    setFile(null);
                                    setPreview(null);
                                }}
                                placeholder="Paste Image URL..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">OR</span>
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
                                    className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-purple-400 hover:bg-purple-50 transition-colors"
                                >
                                    {file ? 'Change File' : 'Upload from Computer'}
                                </button>
                                {file && <span className="text-xs text-green-600 font-medium">{file.name}</span>}
                            </div>
                        </div>

                        {(imageUrl || preview) && (
                            <div className="mt-2 relative h-20 w-32 overflow-hidden rounded-lg border border-gray-200">
                                <img src={imageUrl || preview!} alt="Preview" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setImageUrl(''); setFile(null); setPreview(null); }}
                                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-lg bg-[#4f46e5] py-2.5 font-medium text-white shadow-lg shadow-indigo-200 hover:bg-[#4338ca] transition-all"
                        >
                            {initialData ? 'Update Ticket' : 'Create Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketFormModal;
