'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { Bell, Check, CheckCheck, Trash2, X, AlertCircle, Info, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useNotifications, Notification, NotificationType } from '@/context/NotificationContext';

type FilterTab = 'all' | 'unread' | 'reporter' | 'broadcaster' | 'system' | 'alert';

const typeConfig: Record<NotificationType, { icon: React.ElementType; bg: string; text: string; border: string }> = {
    info:    { icon: Info,          bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100' },
    success: { icon: CheckCircle,   bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    error:   { icon: AlertCircle,   bg: 'bg-red-50',     text: 'text-red-500',     border: 'border-red-100' },
};

const categoryColors: Record<string, string> = {
    reporter:    'bg-indigo-100 text-indigo-700',
    broadcaster: 'bg-purple-100 text-purple-700',
    system:      'bg-gray-100 text-gray-600',
    alert:       'bg-red-100 text-red-700',
};

const avatarColors = [
    'bg-indigo-400', 'bg-purple-400', 'bg-emerald-400',
    'bg-orange-400', 'bg-pink-400', 'bg-cyan-400',
];

function getAvatarColor(id: string) {
    const idx = parseInt(id, 10) % avatarColors.length;
    return avatarColors[idx] || 'bg-gray-400';
}

function NotificationCard({ n, onRead, onDelete }: { n: Notification; onRead: () => void; onDelete: () => void }) {
    return (
        <div className={clsx(
            'group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200',
            n.read ? 'bg-white border-gray-100' : 'bg-indigo-50/40 border-indigo-100 shadow-sm'
        )}>
            {!n.read && <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-indigo-500" />}

            <div className={clsx(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-semibold shadow-sm',
                getAvatarColor(n.id)
            )}>
                {n.initials}
            </div>

            <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className={clsx('text-sm font-semibold', n.read ? 'text-gray-700' : 'text-gray-900')}>
                        {n.title}
                    </p>
                    <span className={clsx(
                        'text-[11px] font-bold px-2 py-0.5 rounded-full',
                        n.user_role === 'superadmin' ? 'bg-indigo-100 text-indigo-700' : 
                        n.user_role === 'broadcaster' ? 'bg-purple-100 text-purple-700' :
                        categoryColors[n.category] || 'bg-gray-100 text-gray-600'
                    )}>
                        {n.user_role === 'superadmin' ? 'superadmin' :
                         n.user_role === 'broadcaster' ? (n.created_by_name ? `${n.created_by_name} (${n.created_by_code})` : `broadcaster (${n.created_by_code})`) :
                         n.category}
                    </span>
                    {n.ticket_id && (
                        <span className="text-[11px] text-gray-400 font-mono">#{n.ticket_id}</span>
                    )}
                </div>

                <p className="text-sm text-gray-500 leading-snug">{n.message}</p>
                <div className="mt-2 flex items-center gap-3 flex-wrap">
                    {n.ticket_status && (
                        <span className={clsx(
                            'text-[11px] font-bold px-2 py-0.5 rounded-full border',
                            n.ticket_status === 'urgent'     ? 'bg-red-50 text-red-600 border-red-200' :
                            n.ticket_status === 'new'        ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                            n.ticket_status === 'assessment' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                            n.ticket_status === 'backlog'    ? 'bg-slate-100 text-slate-600 border-slate-200' :
                            n.ticket_status === 'progress'   ? 'bg-pink-50 text-pink-600 border-pink-200' :
                            n.ticket_status === 'pending'    ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                            n.ticket_status === 'completed'  ? 'bg-green-50 text-green-600 border-green-200' :
                            n.ticket_status === 'blocked'    ? 'bg-red-50 text-red-700 border-red-200' :
                                                               'bg-gray-50 text-gray-600 border-gray-200'
                        )}>
                            {n.ticket_status === 'urgent'     ? '🔴 Urgent' :
                             n.ticket_status === 'new'        ? '🔵 New / Open' :
                             n.ticket_status === 'assessment' ? '🟣 Assessment' :
                             n.ticket_status === 'backlog'    ? '⚫ Backlog' :
                             n.ticket_status === 'progress'   ? '🟠 In Progress' :
                             n.ticket_status === 'pending'    ? '🟡 Pending Input' :
                             n.ticket_status === 'completed'  ? '🟢 Completed' :
                             n.ticket_status === 'blocked'    ? '🔴 Blocked' :
                              n.ticket_status}
                        </span>
                    )}
                    <span className="text-xs text-gray-400">{n.time}</span>
                </div>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!n.read && (
                    <button onClick={onRead} title="Mark as read"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <Check className="h-4 w-4" />
                    </button>
                )}
                <button onClick={onDelete} title="Delete"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

const TABS: { key: FilterTab; label: string }[] = [
    { key: 'all',         label: 'All' },
    { key: 'unread',      label: 'Unread' },
    { key: 'reporter',    label: 'Reporter' },
    { key: 'broadcaster', label: 'Broadcaster' },
    { key: 'system',      label: 'System' },
    { key: 'alert',       label: 'Alert' },
];

export default function NotificationsPage() {
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification, clearAll, refresh } = useNotifications();
    const [activeTab, setActiveTab] = useState<FilterTab>('all');

    const filtered = notifications.filter((n: Notification) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'unread') return !n.read;
        return n.category === activeTab;
    });

    return (
        <div className="flex h-screen bg-white font-sans text-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <div className="mx-auto max-w-2xl">

                        {/* Header */}
                        <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 shadow-md">
                                    <Bell className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                                    <p className="text-sm text-gray-400">
                                        {isLoading ? 'Loading...' : unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={refresh}
                                    className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                    title="Refresh"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </button>
                                {unreadCount > 0 && (
                                    <button onClick={markAllAsRead}
                                        className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors">
                                        <CheckCheck className="h-3.5 w-3.5" />
                                        Mark all read
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button onClick={clearAll}
                                        className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Clear all
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mb-4 flex gap-1 overflow-x-auto rounded-2xl bg-white border border-gray-100 p-1 shadow-sm">
                            {TABS.map((tab) => {
                                const count =
                                    tab.key === 'all' ? notifications.length
                                    : tab.key === 'unread' ? unreadCount
                                    : notifications.filter((n: Notification) => n.category === tab.key).length;

                                return (
                                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                        className={clsx(
                                            'flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all',
                                            activeTab === tab.key
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                                        )}>
                                        {tab.label}
                                        {count > 0 && (
                                            <span className={clsx(
                                                'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                                                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                                            )}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Loading */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                                <Bell className="h-10 w-10 text-gray-200" />
                                <p className="text-sm font-medium text-gray-400">No notifications here</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {filtered.map((n: Notification) => (
                                    <NotificationCard key={n.id} n={n}
                                        onRead={() => markAsRead(n.id)}
                                        onDelete={() => deleteNotification(n.id)}
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}