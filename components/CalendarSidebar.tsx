import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Task } from '../types';

/* 
 * CALENDAR SIDEBAR COMPONENT
 * Dimensions: Fixed Width 18rem (w-72 / ~288px)
 * Behavior: Hidden on small screens, Flex on XL screens
 * Structure: Header (Month Nav), Grid (7 cols), Schedule List
 */

interface EventCardProps {
    icon: string;
    iconColor: string;
    bg: string;
    title: string;
    time: string;
    tag?: string; // e.g. "Deadline"
    isTask?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ icon, iconColor, bg, title, time, tag, isTask }) => (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${isTask ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' : 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'}`}>
        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
            <Icon name={icon} className={`${iconColor} text-lg`} />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
                <h4 className="text-sm font-bold text-text-light dark:text-text-dark leading-tight mb-0.5 truncate pr-2">{title}</h4>
                {tag && <span className="text-[9px] uppercase font-bold tracking-wide text-red-500 bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded">{tag}</span>}
            </div>
            <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark font-medium">{time}</p>
        </div>
    </div>
);

// Mock Data for "Today" filler
const MOCK_TODAY_EVENTS = [
    { icon: 'videocam', iconColor: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', title: 'Motion Design Sync', time: '09:30 AM' },
    { icon: 'coffee', iconColor: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', title: 'Team Coffee Break', time: '10:30 AM' },
];

interface CalendarSidebarProps {
    tasks?: Task[];
}

interface CustomEvent {
    id: string;
    date: Date;
    title: string;
    time: string;
    type: 'meeting' | 'work' | 'other';
}

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({ tasks = [] }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Custom Events State
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('12:00');
  
  const days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  
  const currentMonth = viewDate.toLocaleString('default', { month: 'long' });
  const currentYear = viewDate.getFullYear();
  
  // Helper to parse loose task dates like "Due: Nov 20"
  const parseTaskDate = (dateStr: string | undefined): Date | null => {
      if (!dateStr) return null;
      const clean = dateStr.replace(/Due:\s*/i, '').replace(/Due\s*/i, '').trim();
      const lower = clean.toLowerCase();

      const today = new Date();
      if (lower.includes('today')) return today;
      if (lower.includes('tomorrow')) {
          const d = new Date(today);
          d.setDate(today.getDate() + 1);
          return d;
      }
      if (lower.includes('days left')) return null; // Too vague for calendar placement usually

      // Try "MMM DD" format
      const currentYear = new Date().getFullYear();
      const parsed = new Date(`${clean} ${currentYear}`);
      
      // If valid date
      if (!isNaN(parsed.getTime())) {
          return parsed;
      }
      return null;
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => {
      const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      return day === 0 ? 6 : day - 1; 
  };

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  
  const handleTodayClick = () => {
      const now = new Date();
      setViewDate(now);
      setSelectedDate(now);
  };

  const isSameDate = (d1: Date, d2: Date) => {
      return d1.getDate() === d2.getDate() && 
             d1.getMonth() === d2.getMonth() && 
             d1.getFullYear() === d2.getFullYear();
  };

  const daysInMonth = getDaysInMonth(viewDate);
  const startDay = getFirstDayOfMonth(viewDate);
  
  const calendarGrid = [];
  for (let i = 0; i < startDay; i++) calendarGrid.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarGrid.push(i);

  // --- Data Processing for Selected Date ---
  
  // 1. Filter Tasks for selected date
  const tasksForDay = tasks.filter(t => {
      const d = parseTaskDate(t.dueDate);
      return d && isSameDate(d, selectedDate);
  });

  // 2. Filter Custom Events for selected date
  const eventsForDay = customEvents.filter(e => isSameDate(e.date, selectedDate));

  // 3. Mock events (only if Today and no other events, to look busy)
  const isToday = isSameDate(selectedDate, new Date());
  const showMockEvents = isToday && tasksForDay.length === 0 && eventsForDay.length === 0;

  const displayDateString = isToday ? 'Today' : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Handle Adding Event
  const handleAddEvent = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newEventTitle) return;

      const newEvent: CustomEvent = {
          id: `evt-${Date.now()}`,
          date: selectedDate,
          title: newEventTitle,
          time: newEventTime,
          type: 'work'
      };

      setCustomEvents([...customEvents, newEvent]);
      setNewEventTitle('');
      setIsAddingEvent(false);
  };

  return (
    <div className="w-72 h-full bg-surface-light dark:bg-surface-dark border-l border-border-light dark:border-border-dark hidden xl:flex flex-col flex-shrink-0 overflow-y-auto scrollbar-hide pb-10">
        
        <div className="p-5 space-y-6">
            {/* Calendar Widget */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 
                        className="font-bold text-sm text-text-light dark:text-text-dark cursor-pointer hover:text-primary transition-colors select-none" 
                        onClick={() => setViewDate(new Date())}
                        title="Return to current month"
                    >
                        {currentMonth} {currentYear}
                    </h3>
                    <div className="flex gap-1">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors text-text-secondary-light dark:text-text-secondary-dark">
                            <Icon name="chevron_left" className="text-lg" />
                        </button>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors text-text-secondary-light dark:text-text-secondary-dark">
                            <Icon name="chevron_right" className="text-lg" />
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {days.map(d => (
                        <span key={d} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 select-none">{d}</span>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                    {calendarGrid.map((day, idx) => {
                        if (!day) return <div key={idx} className="aspect-square"></div>;
                        
                        const dateObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                        const isSelected = isSameDate(dateObj, selectedDate);
                        const isRealToday = isSameDate(dateObj, new Date());
                        
                        // Check for content on this day
                        const hasTask = tasks.some(t => {
                            const d = parseTaskDate(t.dueDate);
                            return d && isSameDate(d, dateObj);
                        });
                        const hasEvent = customEvents.some(e => isSameDate(e.date, dateObj));
                        const hasDot = hasTask || hasEvent;
                        const dotColor = hasTask ? 'bg-red-500' : 'bg-primary';

                        return (
                            <div key={idx} className="aspect-square flex items-center justify-center relative">
                                <button 
                                    onClick={() => { setSelectedDate(dateObj); setIsAddingEvent(false); }}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-all relative z-10
                                        ${isSelected 
                                            ? 'bg-primary text-white shadow-md ring-2 ring-primary/20 scale-110' 
                                            : isRealToday
                                                ? 'bg-primary/10 text-primary font-bold'
                                                : 'text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {day}
                                </button>
                                {hasDot && !isSelected && (
                                    <div className={`absolute bottom-1 w-1 h-1 rounded-full ${dotColor}`}></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Schedule Section */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Schedule • {displayDateString}
                    </span>
                    <div className="flex items-center gap-2">
                         {!isToday && (
                             <button onClick={handleTodayClick} className="text-[10px] text-primary hover:underline font-medium">
                                Today
                             </button>
                         )}
                         <button 
                            onClick={() => setIsAddingEvent(!isAddingEvent)}
                            className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors text-gray-600 dark:text-gray-300"
                            title="Add Event"
                         >
                             <Icon name={isAddingEvent ? "remove" : "add"} className="text-sm" />
                         </button>
                    </div>
                </div>

                {/* Add Event Form */}
                {isAddingEvent && (
                    <form onSubmit={handleAddEvent} className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-xl border border-primary/20 shadow-lg animate-in slide-in-from-top-2 fade-in duration-200">
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Event Title..." 
                            className="w-full text-sm mb-2 px-2 py-1 bg-transparent border-b border-gray-200 dark:border-gray-600 focus:border-primary outline-none text-text-light dark:text-text-dark"
                            value={newEventTitle}
                            onChange={(e) => setNewEventTitle(e.target.value)}
                        />
                        <div className="flex items-center justify-between">
                            <input 
                                type="time" 
                                value={newEventTime}
                                onChange={(e) => setNewEventTime(e.target.value)}
                                className="text-xs bg-gray-50 dark:bg-gray-700 rounded px-1 py-0.5 border-none outline-none text-text-secondary-light dark:text-text-secondary-dark"
                            />
                            <button type="submit" className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary-light transition-colors">
                                Add
                            </button>
                        </div>
                    </form>
                )}

                <div className="space-y-2.5">
                    {/* 1. Real Deadlines */}
                    {tasksForDay.map(task => (
                        <EventCard 
                            key={task.id}
                            icon={task.dueStatus === 'urgent' ? 'warning' : 'event_busy'}
                            iconColor="text-red-600 dark:text-red-400"
                            bg="bg-red-100 dark:bg-red-900/20"
                            title={task.title}
                            time="Deadline: EOD"
                            tag="Deadline"
                            isTask
                        />
                    ))}

                    {/* 2. Custom Events */}
                    {eventsForDay.map(evt => (
                        <EventCard 
                            key={evt.id}
                            icon="event"
                            iconColor="text-blue-600 dark:text-blue-400"
                            bg="bg-blue-50 dark:bg-blue-900/20"
                            title={evt.title}
                            time={evt.time}
                        />
                    ))}

                    {/* 3. Empty State or Mock Events */}
                    {tasksForDay.length === 0 && eventsForDay.length === 0 && (
                        <>
                            {showMockEvents ? (
                                MOCK_TODAY_EVENTS.map((evt, i) => <EventCard key={i} {...evt} />)
                            ) : (
                                <div className="text-center py-6 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">No events scheduled.</p>
                                    <button onClick={() => setIsAddingEvent(true)} className="text-[10px] text-primary font-medium mt-1 hover:underline">
                                        Create one?
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};