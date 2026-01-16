import React, { useState, useEffect, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { TAG_STYLES, CLIENT_COLORS } from '../constants';
import { Icon } from './Icon';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onDoubleClick?: (task: Task) => void;
  // Props injected by Sortable Wrapper
  style?: React.CSSProperties;
  attributes?: any;
  listeners?: any;
  setNodeRef?: (node: HTMLElement | null) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
    task, 
    isOverlay, 
    onDoubleClick,
    style,
    attributes,
    listeners,
    setNodeRef
}) => {
  // Force re-render periodically to update countdowns
  const [now, setNow] = useState(new Date());
  useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
      return () => clearInterval(timer);
  }, []);

  // Sort Revisions
  const sortedRevisions = useMemo(() => {
    if (!task.revisions || task.revisions.length === 0) return [];
    return [...task.revisions].sort((a, b) => a.number - b.number);
  }, [task.revisions]);

  const baseClasses = "bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all group relative select-none flex flex-col gap-3 touch-none overflow-hidden";
  const overlayClasses = "cursor-grabbing rotate-2 scale-105 shadow-2xl z-50 ring-2 ring-primary/50 opacity-100";
  const normalClasses = "hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 cursor-grab active:cursor-grabbing";

  // Helper to get payment badge style
  const getPaymentBadgeStyle = (status?: string) => {
      switch (status) {
          case 'Paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
          case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
          case 'Overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
          default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      }
  };

  // Configuration for date display
  const getFooterConfig = () => {
    // 1. To-Do Column: Show Creation Date
    if (task.columnId === 'todo') {
        const dateToShow = task.createdAt || task.date;
        if (!dateToShow) return null;
        return {
            text: `Created: ${dateToShow}`,
            icon: 'calendar_today',
            color: 'text-gray-400 dark:text-gray-500',
            labelColor: 'text-gray-500 dark:text-gray-400 font-medium'
        };
    }

    // 2. In Progress Column: Show Due Date / Deadline logic
    if (task.columnId === 'in-progress') {
        
        // Priority: Check ISO Deadline timestamp for "Today" logic
        if (task.deadline) {
            const deadlineDate = new Date(task.deadline);
            const isToday = now.getDate() === deadlineDate.getDate() && 
                            now.getMonth() === deadlineDate.getMonth() && 
                            now.getFullYear() === deadlineDate.getFullYear();
            
            if (isToday) {
                const diffMs = deadlineDate.getTime() - now.getTime();
                const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
                
                if (diffMs < 0) {
                    // Overdue today
                    return { 
                        text: 'OVERDUE (Today)', 
                        icon: 'error_outline', 
                        color: 'text-red-600', 
                        labelColor: 'text-red-700 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded' 
                    };
                } else {
                    // Due today in future
                    return { 
                        text: `DUE TODAY (in ~${diffHours}h)`, 
                        icon: 'timer', 
                        color: 'text-red-500', 
                        labelColor: 'text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded' 
                    };
                }
            }
        }

        // Fallback to manual dueDate string or legacy behavior
        if (!task.dueDate) return null;
        
        // Use existing dueStatus logic for colors if no dynamic match
        switch (task.dueStatus) {
            case 'urgent':
                return { text: task.dueDate, icon: 'timer', color: 'text-red-500 dark:text-red-400', labelColor: 'text-red-600 dark:text-red-400 font-semibold' };
            case 'warning':
                return { text: task.dueDate, icon: 'warning', color: 'text-orange-500 dark:text-orange-400', labelColor: 'text-orange-600 dark:text-orange-400 font-medium' };
            case 'info':
                return { text: task.dueDate, icon: 'hourglass_top', color: 'text-blue-500 dark:text-blue-400', labelColor: 'text-blue-600 dark:text-blue-400 font-medium' };
            case 'normal':
            default:
                return { text: task.dueDate, icon: 'calendar_month', color: 'text-gray-400 dark:text-gray-500', labelColor: 'text-gray-500 dark:text-gray-400 font-medium' };
        }
    }

    // 3. Exported: Do NOT show payment status here (it's at the top now), maybe show completion date if needed?
    if (task.columnId === 'exported' && task.dueDate) {
         return { 
            text: `Done: ${task.dueDate}`, 
            icon: 'check_circle', 
            color: 'text-green-500 dark:text-green-400', 
            labelColor: 'text-gray-400 dark:text-gray-500 font-medium text-xs' 
        };
    }

    return null;
  };

  const footerConfig = getFooterConfig();
  const clientColorClass = CLIENT_COLORS[task.clientColor || 'gray'];
  const clientInitial = task.client.charAt(0).toUpperCase();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${baseClasses} ${isOverlay ? overlayClasses : normalClasses}`}
      onDoubleClick={() => onDoubleClick && onDoubleClick(task)}
    >
      {/* Row 1: Tag & Menu */}
      <div className="flex justify-between items-start">
        <div className="flex flex-wrap gap-2">
            {task.columnId === 'exported' ? (
                // Exported View: Show Payment Status
                task.paymentStatus && task.paymentStatus !== 'Unbilled' ? (
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase tracking-wider flex items-center gap-1 ${getPaymentBadgeStyle(task.paymentStatus)}`}>
                        {task.paymentStatus === 'Paid' && <Icon name="check" className="text-[12px] font-bold" />}
                        {task.paymentStatus === 'Overdue' && <Icon name="warning" className="text-[12px] font-bold" />}
                        {task.paymentStatus === 'Pending' && <Icon name="hourglass_empty" className="text-[12px] font-bold" />}
                        {task.paymentStatus}
                    </span>
                ) : null
            ) : (
                // Standard View (To-Do, In Progress, Revision): Show Category Tag
                <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase tracking-wider ${TAG_STYLES[task.tagStyle]}`}>
                    {task.tag}
                </span>
            )}
        </div>

        <button 
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors -mr-1 -mt-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50"
          onPointerDown={(e) => e.stopPropagation()}
        >
             <Icon name="more_horiz" className="text-xl" />
        </button>
      </div>

      {/* Row 2: Client */}
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${clientColorClass}`}>
            {clientInitial}
        </div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {task.client}
        </span>
      </div>

      {/* Row 3: Title */}
      <h4 className="text-[17px] font-bold text-gray-900 dark:text-gray-100 leading-snug">
        {task.title}
      </h4>

      {/* REVISION LIST (If any) */}
      {sortedRevisions.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
              {sortedRevisions.map((rev) => (
                  <div 
                      key={rev.id}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                          e.stopPropagation();
                          if (onDoubleClick) onDoubleClick(task);
                      }}
                      className="bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 p-2.5 rounded-lg text-sm text-text-light dark:text-text-dark font-medium cursor-pointer transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600 flex items-center justify-between group/rev"
                  >
                      <span>Revision {rev.number}</span>
                      {rev.status === 'Completed' ? (
                          <Icon name="check_circle" className="text-green-500 text-sm" />
                      ) : (
                          <Icon name="arrow_forward" className="text-gray-400 text-sm opacity-0 group-hover/rev:opacity-100 transition-opacity" />
                      )}
                  </div>
              ))}
          </div>
      )}

      {/* Row 4: Date / Footer (Dynamic based on column) */}
      {footerConfig && (
        <div className="mt-1 pt-1">
             <div className="flex items-center gap-2">
                <Icon name={footerConfig.icon} className={`${footerConfig.color} text-[18px]`} />
                <span className={`text-sm ${footerConfig.labelColor}`}>
                    {footerConfig.text}
                </span>
             </div>
        </div>
      )}
    </div>
  );
};

export const SortableTaskCard: React.FC<{
  task: Task;
  onDoubleClick?: (task: Task) => void;
  onUpdateTask?: (task: Task) => void;
}> = ({ task, onDoubleClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    // CSS.Transform is more robust than CSS.Translate in some environments
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none' // Essential for touch drag
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-40 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-primary/40 rounded-2xl h-[200px]"
      />
    );
  }

  return (
    <TaskCard 
        task={task} 
        style={style} 
        attributes={attributes} 
        listeners={listeners} 
        setNodeRef={setNodeRef}
        onDoubleClick={onDoubleClick}
    />
  );
};