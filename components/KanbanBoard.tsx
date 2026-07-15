import React from 'react';
import TicketCard from './TicketCard';
import { Trash2 } from 'lucide-react';
import {
    DndContext,
    useDraggable,
    useDroppable,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragStartEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface KanbanBoardProps {
    tickets: any[];
    onTicketMove: (id: string, newStatus: string) => void;
    onDelete: (id: string) => void;
    onSolve: (id: string) => void;
    onBlock: (id: string) => void;
    onDeleteAll: (status: string) => void;
    onTicketClick: (ticket: any) => void;
}

// Draggable Ticket Wrapper
const DraggableTicket = ({ ticket, onDelete, onSolve, onBlock, onDoubleClick, isDragging: isOverlay }: { ticket: any, onDelete: (id: string) => void, onSolve: (id: string) => void, onBlock: (id: string) => void, onDoubleClick: (ticket: any) => void, isDragging?: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: ticket.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
    };

    // If it's being dragged (and not the overlay), we just show a semi-transparent card as a placeholder
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <TicketCard {...ticket} onDelete={onDelete} onSolve={onSolve} onBlock={onBlock} onDoubleClick={onDoubleClick} />
        </div>
    );
};

// Droppable Column Wrapper
const DroppableColumn = ({
    colId,
    title,
    color,
    children,
    onDeleteAll,
    ticketCount
}: {
    colId: string;
    title: string;
    color: string;
    children: React.ReactNode;
    onDeleteAll?: (status: string) => void;
    ticketCount: number;
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: colId,
    });

    return (
        <div ref={setNodeRef} className={`flex w-[280px] flex-col gap-4 ${isOver ? 'opacity-80' : ''}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`h-6 w-1 rounded-full ${color}`}></div>
                    <h3 className="font-bold text-gray-700">{title}</h3>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{ticketCount}</span>
                </div>
                {ticketCount > 0 && onDeleteAll && (colId === 'completed' || colId === 'blocked') && (
                    <button
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete all tickets in ${title}?`)) {
                                onDeleteAll(colId);
                            }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all group"
                        title={`Delete all in ${title}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-4 max-h-[calc(100vh-220px)] overflow-y-auto overflow-x-hidden no-scrollbar bg-gray-50/50 rounded-xl p-2 border border-dashed border-gray-100/50">
                {children}
            </div>
        </div>
    );
};

const KanbanBoard = ({ tickets, onTicketMove, onDelete, onSolve, onBlock, onDeleteAll, onTicketClick }: KanbanBoardProps) => {
    const [activeTicket, setActiveTicket] = React.useState<any>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 8,
            },
        })
    );

    const columns = [
        { id: 'urgent', title: 'Urgent', color: 'bg-red-400' },
        { id: 'new', title: 'New/ Open', color: 'bg-indigo-300' },
        { id: 'assessment', title: 'Assessment', color: 'bg-purple-300' },
        { id: 'backlog', title: 'Backlog', color: 'bg-gray-400' },
        { id: 'progress', title: 'In Progress', color: 'bg-pink-300' },
        { id: 'pending', title: 'Pending Input/Waiting', color: 'bg-yellow-200' },
        { id: 'blocked', title: 'Blocked', color: 'bg-red-300' },
        { id: 'completed', title: 'Completed', color: 'bg-green-400' },
    ];

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const ticket = tickets.find((t) => t.id === active.id);
        setActiveTicket(ticket);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTicket(null);

        if (over && active.id !== over.id) {
            onTicketMove(active.id as string, over.id as string);
        }
    };

    const handleDragCancel = () => {
        setActiveTicket(null);
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className="flex h-full flex-1 overflow-x-auto overflow-y-hidden bg-white px-8 pb-8 pt-4">
                <div className="flex gap-6 min-w-max">
                    {columns.map((column) => (
                        <DroppableColumn
                            key={column.id}
                            colId={column.id}
                            title={column.title}
                            color={column.color}
                            onDeleteAll={onDeleteAll}
                            ticketCount={tickets.filter(t => t.status === column.id).length}
                        >
                            {tickets.filter(t => t.status === column.id).map((ticket) => (
                                <DraggableTicket key={ticket.id} ticket={ticket} onDelete={onDelete} onSolve={onSolve} onBlock={onBlock} onDoubleClick={onTicketClick} />
                            ))}
                            {tickets.filter(t => t.status === column.id).length === 0 && (
                                <div className="text-center text-gray-300 text-xs py-10 pointer-events-none">Drop here</div>
                            )}
                        </DroppableColumn>
                    ))}
                </div>
            </div>

            <DragOverlay dropAnimation={{
                duration: 250,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}>
                {activeTicket ? (
                    <div className="opacity-90 scale-105 transition-transform cursor-grabbing">
                        <TicketCard
                            {...activeTicket}
                            onDelete={() => { }}
                            onSolve={() => { }}
                            onBlock={() => { }}
                            onDoubleClick={() => { }}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default KanbanBoard;
