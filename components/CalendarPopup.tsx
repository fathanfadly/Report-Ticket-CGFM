import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface CalendarPopupProps {
    currentDate: Date;
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
    onClose?: () => void;
}

const CalendarPopup = ({ currentDate: initialDate, selectedDate, onSelectDate }: CalendarPopupProps) => {
    const [currentMonth, setCurrentMonth] = React.useState(initialDate);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = [];
    const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    const dayInterval = eachDayOfInterval({ start: startDate, end: endDate });

    return (
        <div className="absolute top-12 left-0 z-50 w-[300px] rounded-xl bg-white p-4 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 mb-2">
                {weekDays.map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-400 py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {dayInterval.map((day) => {
                    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => onSelectDate(day)}
                            className={clsx(
                                "flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors",
                                !isCurrentMonth && "text-gray-300",
                                isCurrentMonth && !isSelected && "text-gray-700 hover:bg-gray-100",
                                isSelected && "bg-[#4f46e5] text-white font-semibold shadow-md"
                            )}
                        >
                            {format(day, dateFormat)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarPopup;
