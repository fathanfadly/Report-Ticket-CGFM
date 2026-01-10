import { MessageSquare, ThumbsUp, Trash2, Calendar as CalendarIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';

interface TicketCardProps {
    id: string;
    title: string;
    tags?: { label: string; color: string }[];
    date: string;
    image_url?: string;
    likes: number;
    priority?: "P1" | "P2" | "P3";
    created_at?: string;
    status: string;
    solution?: string;
    onDelete: (id: string) => void;
    onSolve: (id: string) => void;
    onBlock?: (id: string) => void;
    onClick?: (ticket: any) => void;
}

const TicketCard = ({ id, title, tags, date, image_url, likes, priority, created_at, status, solution, onDelete, onSolve, onBlock, onClick }: TicketCardProps) => {
    const isCompleted = status === 'completed';
    const isBlocked = status === 'blocked';
    const isSpecial = isCompleted || isBlocked;
    return (
        <div
            onClick={() => onClick?.({ id, title, tags, date, image_url, likes, priority, created_at, status, solution })}
            className={clsx(
                "group relative flex w-[280px] flex-col gap-3 rounded-xl bg-white p-3 shadow-sm border transition-all shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-100",
                isCompleted ? "border-green-200 bg-green-50/30" : isBlocked ? "border-red-200 bg-red-50/30" : "border-gray-100 hover:shadow-md active:scale-[0.98]"
            )}
        >
            <div className="absolute right-2 top-2 z-10 hidden items-center gap-1 group-hover:flex">
                {!isSpecial && onSolve && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onSolve(id); }}
                        className="rounded-md bg-white/80 p-1.5 text-green-600 shadow-sm backdrop-blur-sm hover:bg-green-50 transition-all border border-green-100"
                        title="Mark as solved"
                    >
                        <CheckCircle className="h-4 w-4" />
                    </button>
                )}
                {!isSpecial && onBlock && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onBlock(id); }}
                        className="rounded-md bg-white/80 p-1.5 text-red-500 shadow-sm backdrop-blur-sm hover:bg-red-50 transition-all border border-red-100"
                        title="Mark as blocked"
                    >
                        <AlertCircle className="h-4 w-4" />
                    </button>
                )}
                <button
                    onDoubleClick={(e) => { e.stopPropagation(); onDelete(id); }}
                    className="rounded-md bg-white/80 p-1.5 text-gray-500 shadow-sm backdrop-blur-sm hover:bg-gray-100 transition-all border border-gray-100"
                    title="Double click to delete"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {image_url && (
                <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100/50">
                    <img
                        src={image_url}
                        alt={title}
                        className={clsx("h-full w-full object-cover transition-transform duration-300 group-hover:scale-105", isSpecial && "opacity-60 grayscale")}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/600x400/f3f4f6/9ca3af?text=No+Image";
                        }}
                    />
                    <div className="absolute inset-0 bg-black/5"></div>
                </div>
            )}

            <div className="flex items-start gap-2">
                <div className={clsx(
                    "mt-1 h-4 w-4 shrink-0 rounded-full border text-[10px] flex items-center justify-center transition-all",
                    isCompleted ? "border-green-500 bg-green-500 text-white" : isBlocked ? "border-red-500 bg-red-500 text-white" : "border-gray-300 bg-white text-gray-400"
                )}>
                    {isSpecial ? "✓" : "✓"}
                </div>
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <h3 className={clsx(
                        "text-sm font-semibold leading-tight line-clamp-2",
                        isCompleted ? "text-gray-400 line-through" : isBlocked ? "text-red-700" : "text-gray-800"
                    )}>
                        {title}
                    </h3>

                    {solution && (
                        <div className={clsx(
                            "mt-2 rounded-lg p-2 border",
                            isCompleted ? "bg-green-100/50 border-green-200/50" : "bg-red-100/50 border-red-200/50"
                        )}>
                            <p className={clsx(
                                "text-[9px] font-bold uppercase tracking-wider mb-0.5",
                                isCompleted ? "text-green-700" : "text-red-700"
                            )}>
                                {isCompleted ? "Resolution" : "Problem"}
                            </p>
                            <p className={clsx(
                                "text-[11px] leading-normal line-clamp-4 italic",
                                isCompleted ? "text-green-800" : "text-red-800"
                            )}>{solution}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className={clsx(
                    "px-2 py-0.5 text-xs font-medium rounded-md",
                    isCompleted ? "bg-green-100 text-green-700" : isBlocked ? "bg-red-100 text-red-700" : "bg-blue-600 text-white"
                )}>
                    {isCompleted ? "Solved" : isBlocked ? "Blocked" : "Started"}
                </span>
                {priority === "P1" && <span className="px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-md shadow-sm">P1</span>}
                {priority === "P2" && <span className="px-2 py-0.5 text-xs font-semibold text-white bg-orange-500 rounded-md shadow-sm">P2</span>}
                {priority === "P3" && <span className="px-2 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded-md shadow-sm">P3</span>}
            </div>

            <div className="flex flex-col gap-1 border-t border-gray-50 pt-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center text-[8px] text-white">U</div>
                        <span className="text-[10px] text-gray-400">{date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                        <ThumbsUp className="h-3 w-3" />
                        <span className="text-[10px]">{likes}</span>
                    </div>
                </div>

                {created_at && (
                    <div className="flex items-center gap-1 text-gray-300">
                        <CalendarIcon className="h-3 w-3" />
                        <span className="text-[9px] font-medium tracking-tight text-gray-400">
                            Created: {format(parseISO(created_at), 'MMM d, h:mm a')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketCard;
