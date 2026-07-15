"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import {
    Activity,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle,
    Users,
    Radio,
    BrainCircuit,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    ChevronRight,
    MessageSquare
} from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/dashboard/stats');
            const data = await res.json();
            if (res.ok && !data.error) {
                setStats(data);
            } else {
                setStats({ hasError: true, message: data.error || data.message || "Unknown API Error" });
            }
        } catch (error: any) {
            console.error("Failed to fetch dashboard stats:", error);
            setStats({ hasError: true, message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const KpiCard = ({ title, value, icon: Icon, color, trend, trendValue, subtitle }: any) => (
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-50 hover:-translate-y-1">
            <div className={`absolute top-0 right-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700 ${color}`}></div>

            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
                    {subtitle && <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{subtitle}</p>}
                </div>
                <div className={`rounded-2xl p-3 ${color} shadow-lg shadow-gray-100 group-hover:rotate-12 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <div className={clsx(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-tight",
                    trend === 'up' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                    {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {trendValue}
                </div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">vs last week</span>
            </div>
        </div>
    );

    const ProgressBar = ({ label, value, max, color }: any) => {
        const percentage = Math.round((value / max) * 100) || 0;
        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">{label}</span>
                    <span className="text-xs font-black text-gray-900">{value} <span className="text-gray-300 font-bold">/ {percentage}%</span></span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-50 overflow-hidden border border-gray-100/50">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${color}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    if (isLoading && !stats) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Initializing Dashboard...</p>
                </div>
            </div>
        );
    }

    if (stats?.hasError) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-white p-8">
                <div className="text-red-500 mb-4"><AlertCircle className="h-16 w-16" /></div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Failed to load data</h2>
                <p className="text-gray-500 text-center max-w-md bg-gray-50 p-4 rounded-xl border border-gray-100 font-mono text-sm">
                    {stats.message}
                </p>
                <button onClick={() => window.location.reload()} className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Try Again</button>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
                <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 animate-in zoom-in-0 duration-500">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tighter">Service Dashboard</h1>
                            <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                                <Calendar className="h-3 w-3" /> {format(new Date(), 'EEEE, MMMM do yyyy')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-gray-100 rounded-xl">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">System Live</span>
                        </div>
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-95 shadow-sm">
                            <TrendingUp className="h-5 w-5" />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/20">
                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <KpiCard
                                title="Total Tickets"
                                value={stats?.totalTickets || 0}
                                icon={Activity}
                                color="bg-indigo-600"
                                trend="up"
                                trendValue="+14%"
                                subtitle="All-time reports"
                            />
                            <KpiCard
                                title="Active Reporters"
                                value={stats?.totalReporters || 0}
                                icon={Users}
                                color="bg-purple-600"
                                trend="up"
                                trendValue="+5%"
                                subtitle="Registered citizens"
                            />
                            <KpiCard
                                title="Resolution Rate"
                                value={`${stats?.performanceAnalysis?.efficiencyScore}%`}
                                icon={CheckCircle}
                                color="bg-emerald-600"
                                trend="up"
                                trendValue="+12%"
                                subtitle="AI Performance Metric"
                            />
                            <KpiCard
                                title="Avg. Response"
                                value="4.2h"
                                icon={Clock}
                                color="bg-orange-600"
                                trend="down"
                                trendValue="-0.8h"
                                subtitle="Response efficiency"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* AI Performance Analysis Section */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="group relative overflow-hidden rounded-[2.5rem] bg-indigo-900 p-10 shadow-2xl shadow-indigo-200 border border-indigo-800">
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-indigo-600 opacity-20 blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                                                <BrainCircuit className="h-8 w-8 text-white animate-pulse" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white tracking-tighter">AI Service Performance Analytics</h3>
                                                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Predictive Strategy Assistant</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-6">
                                                <p className="text-sm font-medium text-white/90 leading-relaxed italic border-l-4 border-indigo-400 pl-4 py-1">
                                                    "{stats?.performanceAnalysis?.aiSummary}"
                                                </p>
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-indigo-200 uppercase tracking-widest">Strategy Ready</span>
                                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-emerald-300 uppercase tracking-widest">Optimized Flow</span>
                                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-amber-300 uppercase tracking-widest">Trend Analysis Active</span>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 space-y-6 shadow-inner">
                                                <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-4">Stage Distribution Analysis</h4>
                                                <ProgressBar label="Urgent Processing" value={stats?.statusCounts?.urgent || 0} max={stats?.totalTickets} color="bg-red-400 shadow-sm shadow-red-200" />
                                                <ProgressBar label="Active Assessment" value={stats?.statusCounts?.assessment || 0} max={stats?.totalTickets} color="bg-purple-400 shadow-sm shadow-purple-200" />
                                                <ProgressBar label="In Progress Flow" value={stats?.statusCounts?.progress || 0} max={stats?.totalTickets} color="bg-pink-400 shadow-sm shadow-pink-200" />
                                                <ProgressBar label="Success Completion" value={stats?.statusCounts?.completed || 0} max={stats?.totalTickets} color="bg-emerald-400 shadow-sm shadow-emerald-200" />
                                            </div>
                                        </div>

                                        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-8">
                                            <button className="flex items-center gap-2 text-[10px] font-black text-white hover:text-indigo-300 transition-colors uppercase tracking-widest">
                                                Generate Full Performance Report <ChevronRight className="h-3 w-3" />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-3">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-500 border-2 border-indigo-900 flex items-center justify-center text-[10px] text-white font-bold">A</div>
                                                    <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-indigo-900 flex items-center justify-center text-[10px] text-white font-bold">B</div>
                                                    <div className="h-8 w-8 rounded-full bg-slate-700 border-2 border-indigo-900 flex items-center justify-center text-[10px] text-white font-bold">+ {stats?.totalBroadcasters}</div>
                                                </div>
                                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Broadcasters Live</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Distribution Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'New', count: stats?.statusCounts?.new || 0, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                        { label: 'Pending', count: stats?.statusCounts?.pending || 0, color: 'text-amber-600', bg: 'bg-amber-50' },
                                        { label: 'Blocked', count: stats?.statusCounts?.blocked || 0, color: 'text-red-600', bg: 'bg-red-50' },
                                        { label: 'Backlog', count: stats?.statusCounts?.backlog || 0, color: 'text-slate-600', bg: 'bg-slate-50' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</span>
                                            <span className={`text-xl font-black ${item.color}`}>{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity Side Column */}
                            <div className="space-y-6">
                                <div className="rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/50 p-6 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-indigo-600" /> Recent Actions
                                        </h3>
                                        <span className="h-5 w-5 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">
                                            {stats?.recentActivity?.length || 0}
                                        </span>
                                    </div>

                                    <div className="space-y-6 flex-1 overflow-y-auto px-1 custom-scrollbar">
                                        {stats?.recentActivity?.map((activity: any, idx: number) => (
                                            <div key={idx} className="group relative pl-6 border-l-2 border-gray-100 hover:border-indigo-400 transition-colors">
                                                <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-gray-200 group-hover:bg-indigo-600 group-hover:scale-150 transition-all"></div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] font-black text-indigo-600 uppercase bg-indigo-50 px-1.5 py-0.5 rounded tracking-tighter">
                                                            {activity.ticket_status || 'Activity'}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-gray-300">{format(parseISO(activity.created_at), 'HH:mm')}</span>
                                                    </div>
                                                    <p className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-900 transition-colors">{activity.ticket_title}</p>
                                                    <p className="text-[10px] text-gray-400 line-clamp-2 italic leading-relaxed border-l-2 border-gray-50 pl-2">
                                                        "{activity.content}"
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {stats?.recentActivity?.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                                    <Activity className="h-5 w-5 text-gray-200" />
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No recent data</p>
                                            </div>
                                        )}
                                    </div>

                                    <button className="mt-8 w-full py-4 rounded-2xl bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-400 hover:bg-white hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest">
                                        View All System Activity
                                    </button>
                                </div>

                                {/* Quick Stats Mini Card */}
                                <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                                    <div className="absolute right-0 bottom-0 opacity-10">
                                        <BrainCircuit className="h-24 w-24 translate-x-4 translate-y-4" />
                                    </div>
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg border border-white/20">
                                            <Shield className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest opacity-80">Security Audit</h4>
                                            <p className="text-sm font-bold tracking-tight">System Fully Protected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
        </>
    );
}

function Shield(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
    );
}
