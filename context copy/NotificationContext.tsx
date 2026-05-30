'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    time: string;
    read: boolean;
    initials?: string;
    category: 'reporter' | 'broadcaster' | 'system' | 'alert';
    ticket_id?: string;
    created_by_name?: string;
    created_by_code?: string;
    user_role?: string;
    activity_type?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
    refresh: () => void;
}

function getType(activity_type: string, priority: string): NotificationType {
    if (activity_type === 'status_change') return 'warning';
    if (priority === 'P1') return 'error';
    if (priority === 'P2') return 'warning';
    if (priority === 'P3') return 'info';
    return 'info';
}

function getCategory(kategori: string, kode_broadcaster: string | null): Notification['category'] {
    if (!kategori && !kode_broadcaster) return 'system';
    if (kode_broadcaster) return 'broadcaster';
    const k = (kategori || '').toLowerCase();
    if (k.includes('keamanan') || k.includes('kebakaran') || k.includes('kecelakaan')) return 'alert';
    return 'reporter';
}

function timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

function getInitials(title: string): string {
    return title
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || '')
        .join('');
}

function mapRowToNotification(row: any): Notification {
    const title = row.judul_laporan || `Ticket ${row.ticket_id}`;
    return {
        id: String(row.id),
        title,
        message: row.content,
        type: getType(row.activity_type, row.priority),
        time: timeAgo(row.created_at),
        read: false,
        initials: getInitials(title),
        category: getCategory(row.kategori_laporan, row.kode_broadcaster),
        ticket_id: row.ticket_id,
        created_by_name: row.created_by_name,
        created_by_code: row.created_by_code,
        user_role: row.user_role,
        activity_type: row.activity_type,
    };
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (!res.ok) throw new Error('Failed to fetch');
            const rows = await res.json();
            const mapped: Notification[] = rows.map(mapRowToNotification);
            setNotifications(mapped);
        } catch (err) {
            console.error('Notification fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const notificationsWithRead = notifications.map((n) => ({
        ...n,
        read: readIds.has(n.id),
    }));

    const unreadCount = notificationsWithRead.filter((n) => !n.read).length;

    const markAsRead = (id: string) => setReadIds((prev) => new Set([...prev, id]));
    const markAllAsRead = () => setReadIds(new Set(notifications.map((n) => n.id)));
    const deleteNotification = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
    const clearAll = () => { setNotifications([]); setReadIds(new Set()); };

    return (
        <NotificationContext.Provider
            value={{
                notifications: notificationsWithRead,
                unreadCount,
                isLoading,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                clearAll,
                refresh: fetchNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
    return ctx;
}